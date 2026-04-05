<?php
/**
 * Bicyclette Bruzoise – upload.php
 * Point d'entrée API pour la gestion des albums photos.
 *
 * Actions POST :
 *   action=auth     : vérifie le mot de passe capitaine
 *   action=upload   : reçoit les photos d'une sortie, crée/met à jour l'album
 *   action=delete   : supprime un album et ses fichiers
 *
 * INSTALLATION :
 *   - Placer ce fichier dans : assets/api/upload.php
 *   - Créer le dossier       : assets/albums/   (écriture PHP requise)
 *   - Modifier CAPTAIN_PASSWORD ci-dessous
 *
 * Dépendances PHP : GD (extension standard, disponible sur la plupart des hébergements)
 */

// ─── Configuration ──────────────────────────────────────────────────────────

define('CAPTAIN_PASSWORD', 'MotDePasseCapitaine2026'); // <<< À CHANGER
define('SESSION_KEY',      'bb_captain_ok');

define('ALBUMS_DIR',   __DIR__ . '/../../albums/');   // assets/albums/
define('THUMB_WIDTH',  400);   // px largeur miniature
define('THUMB_HEIGHT', 300);   // px hauteur miniature (crop)
define('PHOTO_MAX_W',  1920);  // px largeur max photo pleine taille
define('MAX_UPLOAD_MB', 10);   // taille max par photo

// ─── Bootstrap ──────────────────────────────────────────────────────────────

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Autorise uniquement les requêtes du même domaine
$origin = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_HOST'] ?? '';
// Ajuster si nécessaire pour les domaines de production :
// header('Access-Control-Allow-Origin: https://www.bicyclette-bruzoise.fr');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Méthode non autorisée.']);
    exit;
}

$action = trim($_POST['action'] ?? '');

// ─── Actions ────────────────────────────────────────────────────────────────

switch ($action) {

    case 'auth':
        $pwd = $_POST['password'] ?? '';
        if (hash_equals(CAPTAIN_PASSWORD, $pwd)) {
            $_SESSION[SESSION_KEY] = true;
            echo json_encode(['ok' => true]);
        } else {
            // Petite pause anti-brute-force
            sleep(1);
            echo json_encode(['ok' => false, 'error' => 'Mot de passe incorrect.']);
        }
        break;

    case 'upload':
        requireAuth();
        handleUpload();
        break;

    case 'delete':
        requireAuth();
        handleDelete();
        break;

    default:
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Action inconnue.']);
}
exit;

// ─── Fonctions ──────────────────────────────────────────────────────────────

function requireAuth(): void {
    if (empty($_SESSION[SESSION_KEY])) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'error' => 'Accès refusé.']);
        exit;
    }
}

/**
 * Gère le dépôt d'un album (création ou ajout de photos).
 */
function handleUpload(): void {
    $date      = sanitizeDate($_POST['date']      ?? '');
    $nom       = trim($_POST['nom']               ?? '');
    $capitaine = trim($_POST['capitaine']          ?? '');
    $distance  = intval($_POST['distance']         ?? 0);

    if (!$date || !$nom) {
        echo json_encode(['ok' => false, 'error' => 'Date et nom de sortie obligatoires.']);
        return;
    }

    if (empty($_FILES['photos'])) {
        echo json_encode(['ok' => false, 'error' => 'Aucun fichier reçu.']);
        return;
    }

    $slug    = slugify($date . '_' . $nom);
    $albumDir = ALBUMS_DIR . $slug . '/';
    $photosDir = $albumDir . 'photos/';
    $thumbsDir = $albumDir . 'thumbs/';

    foreach ([$albumDir, $photosDir, $thumbsDir] as $dir) {
        if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
            echo json_encode(['ok' => false, 'error' => "Impossible de créer le dossier $dir"]);
            return;
        }
    }

    // Charger le méta existant si l'album existe déjà
    $metaFile = $albumDir . 'meta.json';
    $meta = file_exists($metaFile)
        ? json_decode(file_get_contents($metaFile), true)
        : ['slug' => $slug, 'nom' => $nom, 'date' => $date, 'capitaine' => $capitaine, 'distance' => $distance ?: null, 'photos' => []];

    $existingPhotos = $meta['photos'] ?? [];

    $files    = normalizeFilesArray($_FILES['photos']);
    $added    = 0;
    $errors   = [];

    foreach ($files as $file) {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $errors[] = $file['name'] . ': erreur upload ' . $file['error'];
            continue;
        }

        if ($file['size'] > MAX_UPLOAD_MB * 1024 * 1024) {
            $errors[] = $file['name'] . ': fichier trop volumineux (max ' . MAX_UPLOAD_MB . ' Mo).';
            continue;
        }

        $mime = mime_content_type($file['tmp_name']);
        if (!in_array($mime, ['image/jpeg', 'image/png', 'image/webp'])) {
            $errors[] = $file['name'] . ': type de fichier non autorisé.';
            continue;
        }

        $ext      = extensionFromMime($mime);
        $basename = uniqid('', true) . '.' . $ext;

        // Photo pleine taille (redimensionnée si besoin)
        $destPhoto = $photosDir . $basename;
        if (!resizeAndSave($file['tmp_name'], $destPhoto, $mime, PHOTO_MAX_W, 0)) {
            $errors[] = $file['name'] . ': erreur traitement image.';
            continue;
        }

        // Miniature (crop centré)
        $destThumb = $thumbsDir . $basename;
        if (!cropAndSave($file['tmp_name'], $destThumb, $mime, THUMB_WIDTH, THUMB_HEIGHT)) {
            $errors[] = $file['name'] . ': erreur génération miniature.';
            // On garde quand même la photo pleine taille
        }

        $existingPhotos[] = $basename;
        $added++;
    }

    $meta['photos']    = $existingPhotos;
    $meta['capitaine'] = $capitaine ?: ($meta['capitaine'] ?? '');
    $meta['distance']  = $distance  ?: ($meta['distance']  ?? null);
    $meta['count']     = count($existingPhotos);
    $meta['preview']   = array_slice($existingPhotos, 0, 4);

    file_put_contents($metaFile, json_encode($meta, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

    // Mettre à jour l'index global
    rebuildIndex();

    if ($added === 0 && $errors) {
        echo json_encode(['ok' => false, 'error' => implode('; ', $errors)]);
    } else {
        echo json_encode([
            'ok'     => true,
            'added'  => $added,
            'slug'   => $slug,
            'errors' => $errors,
        ]);
    }
}

/**
 * Supprime un album et tous ses fichiers.
 */
function handleDelete(): void {
    $slug = preg_replace('/[^a-z0-9_-]/', '', $_POST['slug'] ?? '');
    if (!$slug) {
        echo json_encode(['ok' => false, 'error' => 'Slug invalide.']);
        return;
    }

    $albumDir = ALBUMS_DIR . $slug . '/';
    if (!is_dir($albumDir)) {
        echo json_encode(['ok' => false, 'error' => 'Album introuvable.']);
        return;
    }

    deleteDir($albumDir);
    rebuildIndex();

    echo json_encode(['ok' => true]);
}

/**
 * Reconstruit assets/albums/index.json à partir des meta.json existants.
 */
function rebuildIndex(): void {
    $index = [];
    $dirs  = glob(ALBUMS_DIR . '*/', GLOB_ONLYDIR);
    if ($dirs) {
        foreach ($dirs as $dir) {
            $metaFile = $dir . 'meta.json';
            if (!file_exists($metaFile)) continue;
            $meta = json_decode(file_get_contents($metaFile), true);
            if (!$meta) continue;
            $index[] = [
                'slug'      => $meta['slug']      ?? basename(rtrim($dir, '/')),
                'nom'       => $meta['nom']        ?? '',
                'date'      => $meta['date']       ?? '',
                'capitaine' => $meta['capitaine']  ?? '',
                'distance'  => $meta['distance']   ?? null,
                'count'     => $meta['count']      ?? count($meta['photos'] ?? []),
                'preview'   => $meta['preview']    ?? array_slice($meta['photos'] ?? [], 0, 4),
            ];
        }
        usort($index, fn($a, $b) => strcmp($b['date'], $a['date']));
    }
    file_put_contents(
        ALBUMS_DIR . 'index.json',
        json_encode($index, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
    );
}

// ─── Utilitaires image ───────────────────────────────────────────────────────

/**
 * Redimensionne une image en conservant le ratio (largeur max).
 */
function resizeAndSave(src, string $dest, string $mime, int $maxW, int $maxH): bool {
    [$w, $h] = getimagesize($src);
    if (!$w || !$h) return false;

    $ratio  = $w / $h;
    $newW   = $maxW ?: $w;
    $newH   = $maxH ?: $h;

    if ($maxW && $w > $maxW) {
        $newW = $maxW;
        $newH = (int)($maxW / $ratio);
    }

    $srcImg  = createImageFromMime($src, $mime);
    if (!$srcImg) return false;

    $dstImg  = imagecreatetruecolor($newW, $newH);
    preserveTransparency($dstImg, $mime);
    imagecopyresampled($dstImg, $srcImg, 0, 0, 0, 0, $newW, $newH, $w, $h);

    $result = saveImage($dstImg, $dest, $mime);
    imagedestroy($srcImg);
    imagedestroy($dstImg);
    return $result;
}

/**
 * Crée une miniature par crop centré.
 */
function cropAndSave(string $src, string $dest, string $mime, int $tw, int $th): bool {
    [$w, $h] = getimagesize($src);
    if (!$w || !$h) return false;

    $srcRatio = $w / $h;
    $dstRatio = $tw / $th;

    if ($srcRatio > $dstRatio) {
        // Image plus large : recadrer en largeur
        $cropH = $h;
        $cropW = (int)($h * $dstRatio);
        $cropX = (int)(($w - $cropW) / 2);
        $cropY = 0;
    } else {
        // Image plus haute : recadrer en hauteur
        $cropW = $w;
        $cropH = (int)($w / $dstRatio);
        $cropX = 0;
        $cropY = (int)(($h - $cropH) / 2);
    }

    $srcImg = createImageFromMime($src, $mime);
    if (!$srcImg) return false;

    $dstImg = imagecreatetruecolor($tw, $th);
    preserveTransparency($dstImg, $mime);
    imagecopyresampled($dstImg, $srcImg, 0, 0, $cropX, $cropY, $tw, $th, $cropW, $cropH);

    $result = saveImage($dstImg, $dest, $mime, 85);
    imagedestroy($srcImg);
    imagedestroy($dstImg);
    return $result;
}

function createImageFromMime(string $src, string $mime) {
    return match($mime) {
        'image/jpeg' => imagecreatefromjpeg($src),
        'image/png'  => imagecreatefrompng($src),
        'image/webp' => imagecreatefromwebp($src),
        default      => false,
    };
}

function preserveTransparency($img, string $mime): void {
    if (in_array($mime, ['image/png', 'image/webp'])) {
        imagealphablending($img, false);
        imagesavealpha($img, true);
        $transparent = imagecolorallocatealpha($img, 0, 0, 0, 127);
        imagefilledrectangle($img, 0, 0, imagesx($img), imagesy($img), $transparent);
        imagealphablending($img, true);
    }
}

function saveImage($img, string $dest, string $mime, int $quality = 88): bool {
    return match($mime) {
        'image/jpeg' => imagejpeg($img, $dest, $quality),
        'image/png'  => imagepng($img, $dest, 7),
        'image/webp' => imagewebp($img, $dest, $quality),
        default      => false,
    };
}

function extensionFromMime(string $mime): string {
    return match($mime) {
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
        default      => 'jpg',
    };
}

// ─── Utilitaires divers ──────────────────────────────────────────────────────

function sanitizeDate(string $s): string {
    return preg_match('/^\d{4}-\d{2}-\d{2}$/', $s) ? $s : '';
}

function slugify(string $s): string {
    $s = mb_strtolower($s, 'UTF-8');
    $s = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $s);
    $s = preg_replace('/[^a-z0-9]+/', '-', $s);
    return trim($s, '-');
}

/**
 * Normalise $_FILES['photos'] en tableau d'entrées individuelles.
 */
function normalizeFilesArray(array $files): array {
    $result = [];
    if (is_array($files['name'])) {
        $count = count($files['name']);
        for ($i = 0; $i < $count; $i++) {
            $result[] = [
                'name'     => $files['name'][$i],
                'type'     => $files['type'][$i],
                'tmp_name' => $files['tmp_name'][$i],
                'error'    => $files['error'][$i],
                'size'     => $files['size'][$i],
            ];
        }
    } else {
        $result[] = $files;
    }
    return $result;
}

function deleteDir(string $dir): void {
    if (!is_dir($dir)) return;
    $items = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS),
        RecursiveIteratorIterator::CHILD_FIRST
    );
    foreach ($items as $item) {
        $item->isDir() ? rmdir($item->getRealPath()) : unlink($item->getRealPath());
    }
    rmdir($dir);
}
