# Salles v2 : visage unifié sur la vraie photo (19/10/2026)

**Problème corrigé** : dans `assets/rooms/room_0*.mp4`, le visage de David changeait d'un clip à l'autre. Il était aussi plus fin et plus long que le vrai (ArcFace 0,35 à 0,68).

**Méthode** : face-swap local et gratuit, image par image, sur les 7 clips existants. Je n'ai rien régénéré.
- Moteur : InsightFace `inswapper_128` dans le venv `~/.venvs/saba_qc`, avec CoreML.
- Source du visage : la vraie photo `~/Desktop/DAVID_ITSHAK_MESSAGE_2026-09-10/src/photo_david_sans_doigt.png`.
- Seuls les visages déjà proches de David (ArcFace ≥ 0,25) sont remplacés. Les portraits d'inconnus sur les écrans de `room_03` sont restés intacts : je l'ai vérifié sur l'image entière.
- La tenue (casquette, casque, veste) et le décor viennent du clip d'origine. Ils ne changent pas.
- Salles 01 à 03 : swap + affinage GFPGAN 1.4 à 60 %.
- Salles 04 à 07 : swap + léger renforcement de netteté sur la zone du visage. La machine était saturée (charge supérieure à 480) et GFPGAN y prenait environ 1 minute par image. J'ai comparé les deux méthodes en gros plan : la différence est à peine visible.

**Mesure honnête** : ArcFace contre les 3 autres vraies photos de David. J'ai **exclu la photo source du swap**, sinon le score serait gonflé artificiellement. Les mesures sont prises à 6 instants par clip.

| Salle | Avant | Après | Remarque |
|---|---|---|---|
| room_01_hero | 0,54 à 0,60 | 0,62 à 0,66 | |
| room_02_cinema | 0,35 à 0,47 | 0,63 à 0,66 | Le plus gros gain |
| room_03_web | 0,54 à 0,62 | 0,64 à 0,67 | Les portraits d'inconnus sur les écrans ne sont pas touchés |
| room_04_agents | 0,37 à 0,46 | 0,62 à 0,68 | La dernière image, de profil ou en fondu, n'a pas de visage détectable (0,09 à 0,13, inchangé) |
| room_05_vault | 0,40 à 0,50 | 0,61 à 0,66 | |
| room_06_marketing | 0,47 à 0,63 | 0,62 à 0,65 | **Toujours là : la veste passe du noir au brun au milieu du clip, et la casquette paraît beige sous le projecteur.** Le face-swap ne touche pas aux vêtements |
| room_07_gallery | 0,61 à 0,68 | 0,67 à 0,68 | Déjà bonne au départ, maintenant homogène |

Les 7 salles sont maintenant entre 0,61 et 0,68 (seuil cinéma : 0,65), avec le même visage partout : plus rond, des joues plus pleines, la même barbe, plus proche de la vraie photo.

**Scintillement** : j'ai mesuré l'écart moyen d'une image à l'autre dans la zone du visage, avant et après. L'écart reste à ±7 % de l'original sur les 7 clips (par exemple room_02 : 18,4 → 16,8 ; room_06 : 12,4 → 13,0). Le swap n'ajoute donc pas de tremblement mesurable.

**Fichiers techniques** :
- H.264 1280×720, sans audio, CRF 26, `+faststart`.
- 5,375 s par clip, la même durée et la même boucle que les originaux.
- Poids entre 0,51 et 0,98 Mo.
- Un poster `.webp` par salle, aux mêmes noms que dans `assets/rooms/`.

**Contrôles regardés** :
- `planche.jpg` : la vraie photo et 3 images par salle.
- `visages_avant_apres.jpg` : pour chaque salle, une ligne « avant » et une ligne « après », 6 gros plans du visage chacune, plus la vraie photo.
- 4 images entières comparées avant et après (salles 04, 05 et 07) : pas de bord de collage visible.

**Limite** : `inswapper` travaille en 128 px. Sur les plans où le visage est grand, la peau est un peu plus lisse que sur une vraie photo. Les originaux dans `assets/rooms/` n'ont pas été modifiés.

Rien n'a été envoyé à personne ni publié, et aucun déploiement n'a été fait.
