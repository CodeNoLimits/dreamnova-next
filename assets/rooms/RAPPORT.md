# Salles DreamNova — David entre dans les salles (19/10/2026)

**Méthode** : image d'abord, puis animation. Chaque image fixe est faite par l'outil natif `image_edit` de Grok (abonnement, 0 $). Elle part de deux vraies photos de David, recadrées : le selfie sans doigt et la photo de face devant l'affiche. Je les ai regardées une par une, à côté de la vraie photo. J'ai ensuite animé les images gardées avec `image_to_video` (720p, 6 s, consigne courte, sans prompt négatif). Aucune API payante. Aucun navigateur, donc aucun port ouvert et aucune fenêtre.

**Comptes** : Grok « heavy » et Grok actif « holyrentals ». Aucun refus de quota sur l'ensemble du travail.

**Mesure du visage** : score ArcFace contre 4 vraies photos de David, au début, au milieu et à la fin de chaque clip. Repères : au-dessus de 0,40, c'est la même personne pour le modèle ; le standard « cinéma DreamNova » est 0,65. Pour comparer, l'ancienne ancre IA `david_wardrobe_lock.jpg` fait 0,625.

**Fichiers techniques** : H.264 1280×720, 24 i/s, sans audio, CRF 26, `+faststart` (vérifié : `moov` en tête de fichier). Chaque fichier dure 5,4 s et pèse entre 0,5 et 1,0 Mo. La boucle est fermée par un fondu de 0,6 s entre la fin et le début : au point de bouclage, l'image ne bouge pas plus que d'une image à la suivante en lecture normale.

| Clip | Statut | Ressemblance (honnête) | ArcFace début / milieu / fin | Source | Problèmes |
|---|---|---|---|---|---|
| room_01_hero | KEEP | Bonne : casquette, lunettes, barbe poivre et sel, casque au cou. Visage un peu plus mince que le vrai | 0,65 / 0,59 / 0,57 | image heavy, animation heavy | Rien. Colonnes d'or et verre noir, aucun texte |
| room_02_cinema | KEEP | Moyenne à bonne, même air de famille | 0,52 / 0,53 / 0,48 | image holyrentals, animation holyrentals | Les faisceaux du projecteur changent de forme pendant le plan, ça reste joli. L'écran montre une montagne, aucun texte |
| room_03_web | KEEP | Bonne | 0,62 / 0,64 / 0,60 | image heavy (3e essai), animation heavy | Les essais 1 et 2 sont rejetés : le 1 avait du faux texte sur les écrans, le 2 des statues de type idole et une figure de rabbin. Il reste de petits traits de menu illisibles et, sur les écrans, des portraits d'inconnus créés par l'IA |
| room_04_agents | KEEP | Bonne de face. Il finit de profil, regard vers la droite | 0,60 / 0,52 / 0,49 | image heavy, animation heavy | La baisse du score vient du profil. Les téléphones ont des écrans allumés, sans texte lisible |
| room_05_vault | KEEP | Bonne. Le plan finit en gros plan | 0,57 / 0,57 / 0,49 | image heavy, animation heavy | Aucun texte sur les documents lumineux (ce sont des feuilles vierges) |
| room_06_marketing | KEEP | Bonne au début | 0,67 / 0,54 / 0,60 | image heavy, animation heavy | **La veste passe du noir au brun** au milieu du clip (dérive de couleur de l'animation). Les écrans sont abstraits, sans texte |
| room_07_gallery | KEEP | La meilleure : visage proche et net | 0,68 / 0,68 / 0,66 | image holyrentals, animation holyrentals | Il avance peu (c'est surtout la caméra qui s'approche). Les reflets dans les miroirs ne correspondent pas exactement à sa pose |
| (galerie, version heavy) | REJECT | Faible : visage trop petit et trop générique | 0,30 / 0,27 / 0,24 | heavy | Le plan était plus spectaculaire, mais l'identité n'est pas tenue |

**Verdict global sur la ressemblance** : c'est clairement « David stylisé ». La silhouette, la casquette, les lunettes fines, la barbe et le casque sont justes. **Le visage généré est en revanche un peu plus fin et plus long que le vrai**, qui a les joues plus pleines. On ne voit donc pas un sosie à 100 %. ArcFace donne entre 0,48 et 0,68 : la personne est reconnue, mais on reste en dessous du seuil cinéma de 0,65 sur 5 des 7 clips. Pour une ressemblance à 100 %, il faudrait faire un face-swap (InsightFace, skill `saba-film-image-first`) sur les 7 clips. Je ne l'ai pas fait dans ce lot.

**Fichiers de contrôle** :
- `planche.jpg` : la vraie photo et 3 images par clip. Je l'ai regardée.
- Gros plans des visages côte à côte : `~/opus48/dreamnova_rooms_2026-10-19/visages_vs_vraie_photo.jpg`.
- Images fixes retenues, sources d'animation brutes et scripts (`gen.py`, `score.py`) : `~/opus48/dreamnova_rooms_2026-10-19/`.

Rien n'a été envoyé à personne ni publié, et aucun déploiement n'a été fait.
