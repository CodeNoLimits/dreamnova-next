# Scènes spatiales DreamNova — RAPPORT (19/10/2026)

## Outil et compte
- **Tous les plans : Grok (abonnement SuperGrok, compte `heavy` = dreamaiultimate@gmail.com)**, outils natifs du CLI Grok (`image_gen` puis `image_to_video` en 720p). Aucune API payante.
- Méthode : l'image d'abord (2 à 3 candidats par plan, choix à l'œil après zoom sur la coque pour traquer le texte généré), puis animation image→vidéo avec un prompt court et sans négation.
- **Google Flow / Veo 3.1 n'a pas été utilisé** : le rail Grok a livré les 12 plans. Flow (sortie 1080p) reste possible pour une V2 en plus haute définition.
- Assemblage, boucles, encodage : ffmpeg en local (libx264, crf 26, preset slow, `+faststart`, sans audio, 24 i/s natif).

## Livrables
| Fichier | Format | Durée | Taille | Contenu |
|---|---|---|---|---|
| rocket.mp4 / rocket_m.mp4 | 1280×720 / 720×1280 | 20,7 s | 2,8 / 3,0 Mo | 3 plans fondus : décollage au crépuscule (flammes, fumée, la caméra monte) → percée au-dessus des nuages au coucher du soleil → montée dans l'espace au-dessus de la courbure de la Terre. Pas de boucle (trajet aller). |
| rocket_seq/f_000…f_071.webp | 1280×720, WebP q72 | 72 images | 1,9 Mo au total | Images de rocket.mp4 réparties uniformément, dans l'ordre, pour le défilement image par image. |
| moon.mp4 / moon_m.mp4 | 1280×720 / 720×1280 | 8,8 s | 1,4 / 1,6 Mo | Atterrisseur noir et or, rétrofusées, poussière lunaire, la Terre au loin. En boucle. |
| orbit.mp4 / orbit_m.mp4 | 1280×720 / 720×1280 | 8,8 s | 1,5 / 1,7 Mo | Vaisseau doré devant le Soleil, couronne, protubérances qui grandissent. En boucle. |
| satellite.mp4 / satellite_m.mp4 | 1280×720 / 720×1280 | 8,8 s | 1,9 / 1,5 Mo | Satellite noir et or qui déploie ses panneaux dorés au-dessus de la Terre de nuit (lumières des villes), avec un rayon d'or vers le sol. En boucle. |
| *.webp (8 posters) | taille du clip, q80 | — | 37–86 Ko | Une image clé de chaque clip. |
| planche.jpg | 1920×2051 | — | 0,7 Mo | Planche-contact horodatée des 8 clips (je l'ai regardée en entier). |

Tous les fichiers : H.264, 0 piste audio, moov en tête (faststart vérifié 8/8), < 4 Mo (8/8).

## Boucles
moon / orbit / satellite : la dernière 1,2 s se fond dans le début (fondu croisé), le raccord mesuré équivaut à environ un pas d'image (différence moyenne 2,9–5,0 contre 1,2–4,8 entre deux images normales). Le saut est donc invisible, mais **pendant ces 1,2 s on voit un léger dédoublement** (deux Terres, deux satellites superposés en transparence).

## Gardé / rejeté
| Plan | Gardé | Rejeté et pourquoi |
|---|---|---|
| Décollage | candidat 2 (16:9), candidat 1 (9:16) | 1re série : texte généré « AURORA-9 » sur la coque, fusée penchée hors du pas de tir. Candidat 1 (16:9) : fusée coupée en haut, bord arrondi. |
| Nuages | candidat 1 (16:9), candidat 2 (9:16) | 1re série : « AURORA-7 », cône de vapeur en forme de sac plastique, flammes en carrés dorés. Un candidat 9:16 avait un cadre à coins arrondis. |
| Espace | candidat 2 (16:9 et 9:16) | 1re animation : boule de feu autour de la fusée, qu'on peut prendre pour une explosion → refaite avec un mouvement calme. |
| Lune | candidat 1 (16:9), candidat 2 (9:16) | Anciennes versions écartées au profit de celles avec plus de poussière et la Terre visible. |
| Orbite | candidat 2 (16:9 et 9:16) | Une version avait un rayon laser rose qui traversait le Soleil. |
| Satellite | candidat 1 (16:9), candidat 2 (9:16) | « LINKSTAR-7 » écrit sur le corps d'une version, faux texte illisible sur deux autres. |

Contrôle du texte : chaque image gardée a été zoomée sur la coque ou le corps de l'engin. Aucune lettre lisible, aucun logo réel (ni NASA, ni SpaceX). Le satellite 9:16 porte de petites plaques dorées sans caractères. Aucune personne dans aucun plan.

## Défauts connus (honnêtes)
1. **Résolution 720p** (1280×720 / 720×1280) : c'est la limite de l'`image_to_video` de Grok. Je n'ai pas fait de faux 1080p par agrandissement. La séquence WebP est aussi en 1280×720.
2. Décollage (16:9) : quand la caméra suit la fusée, le haut de la fusée sort du cadre dans la 2e moitié du plan.
3. La fusée change un peu d'aspect entre le plan des nuages (avec boosters) et le plan dans l'espace (corps seul) : à l'écran, ça se lit comme une séparation d'étage.
4. Espace : des filaments d'échappement rappelant des éclairs pendant ~1 s au début du plan.
5. Reflets anamorphiques bleus horizontaux sur le plan des nuages (voulus par le style, mais visibles).
6. Lune : en 16:9, l'atterrisseur est déjà posé (les rétrofusées tournent et la poussière vole, mais on ne voit pas la descente). En 9:16, la descente est visible.
7. Le dédoublement pendant le fondu de boucle (voir plus haut).

## Incidents de production (corrigés)
- Le premier lot a tourné en double (un premier script lancé en chemin relatif a échappé à l'arrêt). Certains clips ont été animés depuis des images rejetées : je les ai détectés en comparant la 1re image de chaque clip avec l'image choisie (écart < 1,1 = bonne source), puis je les ai refaits.
- Un clip « 9:16 » est sorti en 16:9 (c'était une 2e prise du décollage) → écarté et refait.
- Le jeton du compte Grok a été vérifié après coup : il fonctionne et n'a pas changé.
