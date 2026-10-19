# Hypercar DreamNova, version 2 (car2) — 19/10/2026

`assets/car/` n'a pas été modifié. Tout est livré dans `assets/car2/`.

## 1. Outils et comptes
- **Grok CLI, outils natifs** (`image_edit`, `reference_to_video` en 720p), abonnement, 0 $. Deux comptes en parallèle : `heavy` (dreamaiultimate) et `~/.grok/auth.json` (admin@holyrentals). `coding_data_retention_opt_out` = False sur les deux (lu, pas modifié). Un GROK_HOME jetable par appel, supprimé après l'appel.
- **Clé de la cohérence** : `reference_to_video` accepte une **première ET une dernière image imposées** (+ des images clés). La séquence part d'une image extérieure de la voiture et finit sur `assets/car/cockpit.webp` réduit : c'est la même voiture tout du long et la dernière image est le cockpit actuel.
- **Netteté** : chaque image retenue est agrandie ×4 par Real-ESRGAN local (`~/bin/realesrgan`, modèle x4plus, 0 $), puis réduite en 1920×1080 ou 1080×1920 (Lanczos), WebP qualité 72.
- **Google Flow (amordavital58)** : non utilisé. Mon onglet d'arrière-plan sur le proxy 9622 tombait sur « Sélectionner un compte, tous Déconnectés » (`dn-auth-check` à 19:55 : google DÉCONNECTÉ). Pas de login tenté (geste humain). Tout a donc été fait avec Grok.
- Navigateur : uniquement le proxy NEXUS 9622, un onglet créé en arrière-plan, fermé ensuite. Port 9222 jamais touché, Chrome jamais tué.
- Aucune API payante, aucun fal ni Kling.

## 2. Plans : KEEP / REJECT
| Plan | Compte | Verdict |
|---|---|---|
| E1 : image extérieure avec portière ouverte (édition de `car/exterieur_poster`) | holyrentals | **KEEP** : une seule portière en élytre, vitre intégrée. La version heavy est presque identique |
| seqA (première + dernière image, 10 s) ×2 | les deux | REJECT : dans les deux prises, la portière devient translucide et passe devant le cockpit |
| **seqB_holy** (même chose, 12 s, portière « immobile et solide ») | holyrentals | **KEEP → seq/** : portière unique sur 289/289 images, raccord continu jusqu'au cockpit |
| seqB_heavy | heavy | REJECT : écart plus large au passage de la portière |
| seqC (avec 2 images clés) | holyrentals | REJECT : une 3e rangée de sièges apparaît (voiture à 4 places) |
| **seqM_heavy** (9:16, E1 étendue en vertical → cockpit_m) | heavy | **KEEP → seq_m/** : la caméra passe derrière le siège conducteur et descend dans la vue conducteur |
| cockpit_m : extension du cockpit par Grok | holyrentals | partiellement rejetée : le bas généré était flou. Version livrée = **cockpit.webp original au centre** (pixels inchangés), haut de l'extension Grok, bas en fondu vers le noir |
| accel v1 (`accel.mp4`, `accel_m.mp4`, `accel_seq/`) | heavy | livrée avant la remarque du jury, conservée. **Défaut connu** : ce n'est pas la voiture de seq (barre rouge, jantes à 10 branches, échappements qui changent) |
| R : vue 3/4 arrière de la voiture de `seq/f_000` | heavy | **KEEP**. Un petit écusson doré à pseudo-lettres sous l'aileron a été effacé (copie de carrosserie voisine, vérifié à ×5) |
| T : même voiture dans le tunnel doré | heavy | **KEEP**, même écusson effacé |
| accel_v2 prises 1 (« flammes ») ×2 en 16:9 et ×2 en 9:16 | les deux | REJECT : les flammes sortent de 2 à 4 ouvertures basses du diffuseur, pas des deux sorties rondes |
| **av3_holy** (16:9, lueur chaude dans les 2 sorties rondes, sans flammes) | holyrentals | **KEEP → accel_v2.mp4** |
| av3_heavy (16:9) | heavy | REJECT : points lumineux en plus au milieu du plan |
| **av3m_heavy** (9:16) | heavy | **KEEP → accel_v2_m.mp4** |
| av3m_holy (9:16) | holyrentals | REJECT : voiture minuscule au centre, tache rouge parasite au plafond |

## 3. Livrables (mesurés)
- `seq/f_000…f_095.webp` : 96 images, 1920×1080, 8,4 Mo. Extérieur avec portière ouverte → passage de la portière → cockpit. **f_095 = `car/cockpit.webp`** ; f_094 s'en écarte de 4,3/255 en moyenne. Écart entre images voisines : médiane 15,0, maximum 32,3 (f_047, au passage de la portière, mouvement réel et non une coupe). **96/96 images regardées.**
- `seq_m/f_000…f_071.webp` : 72 images, 1080×1920, 5,9 Mo. f_071 = `cockpit_m.webp`. Les 5 images f_066 à f_070 sont fondues vers cockpit_m : sans ce fondu, il y avait un saut (siège éclairé puis bas noir). **72/72 regardées.**
- `cockpit_m.webp` (1080×1920, 71 Ko) + `hotspots_m.json` : les 11 éléments de `car/hotspots.json` projetés par calcul, puis contrôlés à l'œil sur une superposition. Positions corrigées à la main : `ambient` (0,90 ; 0,378), `door` (0,045 ; 0,412). **`seat` est hors cadre** (le siège n'est pas visible en 9:16) : point mis à (0,95 ; 0,70) avec `"visible": false`, à masquer côté site.
- `accel.mp4` (1280×720, 10,04 s, 2,5 Mo), `accel_m.mp4` (720×1280, 10,04 s, 2,4 Mo), `accel_seq/f_000…f_059.webp` (60 images 1920×1080, 4,3 Mo, **60/60 regardées**) : version 1, défaut de voiture expliqué ci-dessus.
- **`accel_v2.mp4`** : H.264 1280×720, 241 images, 10,04 s, sans audio, crf 26, +faststart, 2,29 Mo. **`accel_v2_m.mp4`** : 720×1280, 241 images, 10,04 s, 2,41 Mo. Posters `accel_v2_poster.webp`, `accel_v2_m_poster.webp` (première image). **241/241 images regardées pour chacune** : même voiture que `seq/` (filets dorés, jantes dorées à branches fines, feu arrière fin, aileron), **deux sorties rondes du début à la fin**, studio noir → départ → tunnel de lignes dorées → caméra qui revient en 3/4 arrière.
- `planche.jpg` : planche-contact générale (seq, seq_m + cockpit_m, accel v1, accel_v2, accel_v2_m), regardée.

## 4. Défauts restants (honnête)
- Source native en **720p** (Grok). La netteté vient de Real-ESRGAN : plus nette que la v1 sur le métal et les jantes, mais ce n'est pas du vrai 1080p.
- `seq/` : vers f_030–f_040, la portière ouverte reste nettement penchée ; une petite pièce sombre (charnière ou rétroviseur) est visible en haut à droite. Aucun dédoublement, aucune vitre flottante sur les 96 images.
- `seq/` et `seq_m/` : la caméra entre par la portière **gauche** de l'image mais le dessin intérieur garde le volant à gauche ; aux images f_060–f_070 on voit les deux sièges et le volant de face pendant la descente. Lisible, pas parfait.
- `accel_v2` : un petit **feu central doré** en bas du diffuseur s'allume pendant l'accélération (feu de brouillard façon voiture de course). Ce n'est pas un échappement. La lueur des deux sorties rondes s'éteint quand la voiture est loin dans le tunnel.
- `accel_v2_m` : même feu central ; dans le tunnel (images ≈ 140–200), la voiture est petite au centre.
- Aucun logo de marque réelle, aucun texte généré dans les livrables (les deux écussons à pseudo-lettres trouvés ont été effacés avant animation).
- Les versions v1 (`accel*`) sont conservées comme demandé ; le site devrait passer à `accel_v2*`.
