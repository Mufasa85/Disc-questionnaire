# -*- coding: utf-8 -*-
"""
Mini Test DISC - Calculateur de profil
=======================================
Chaque ligne du tableau correspond à un groupe de 4 adjectifs.
Pour chaque ligne, la personne coche la lettre (a, b, c ou d) qui
correspond à l'adjectif qu'elle a choisi.
Chaque lettre cochée rapporte 1 point à la couleur dans laquelle
elle se trouve sur cette ligne.
"""

CLE_NOTATION = {
    1:  {'Rouge': 'd', 'Jaune': 'c', 'Vert': 'b', 'Bleu':  'a'},
    2:  {'Rouge': 'c', 'Jaune': 'a', 'Vert': 'b', 'Bleu':  'd'},
    3:  {'Rouge': 'b', 'Jaune': 'c', 'Vert': 'a', 'Bleu':  'd'},
    4:  {'Rouge': 'a', 'Jaune': 'd', 'Vert': 'c', 'Bleu':  'b'},
    5:  {'Rouge': 'b', 'Jaune': 'd', 'Vert': 'c', 'Bleu':  'a'},
    6:  {'Rouge': 'c', 'Jaune': 'b', 'Vert': 'a', 'Bleu':  'd'},
    7:  {'Rouge': 'c', 'Jaune': 'a', 'Vert': 'b', 'Bleu':  'd'},
    8:  {'Rouge': 'a', 'Jaune': 'b', 'Vert': 'c', 'Bleu':  'd'},
    9:  {'Rouge': 'd', 'Jaune': 'c', 'Vert': 'a', 'Bleu':  'b'},
    10: {'Rouge': 'a', 'Jaune': 'c', 'Vert': 'b', 'Bleu':  'd'},
    11: {'Rouge': 'd', 'Jaune': 'a', 'Vert': 'c', 'Bleu':  'b'},
    12: {'Rouge': 'c', 'Jaune': 'b', 'Vert': 'd', 'Bleu':  'a'},
    13: {'Rouge': 'd', 'Jaune': 'b', 'Vert': 'a', 'Bleu':  'c'},
    14: {'Rouge': 'a', 'Jaune': 'c', 'Vert': 'd', 'Bleu':  'b'},
    15: {'Rouge': 'd', 'Jaune': 'b', 'Vert': 'c', 'Bleu':  'a'},
    16: {'Rouge': 'b', 'Jaune': 'a', 'Vert': 'd', 'Bleu':  'c'},
    17: {'Rouge': 'c', 'Jaune': 'd', 'Vert': 'a', 'Bleu':  'b'},
    18: {'Rouge': 'd', 'Jaune': 'a', 'Vert': 'b', 'Bleu':  'c'},
    19: {'Rouge': 'b', 'Jaune': 'c', 'Vert': 'd', 'Bleu':  'a'},
    20: {'Rouge': 'a', 'Jaune': 'b', 'Vert': 'd', 'Bleu':  'c'},
    21: {'Rouge': 'c', 'Jaune': 'd', 'Vert': 'b', 'Bleu':  'a'},
    22: {'Rouge': 'a', 'Jaune': 'd', 'Vert': 'b', 'Bleu':  'c'},
    23: {'Rouge': 'b', 'Jaune': 'a', 'Vert': 'c', 'Bleu':  'd'},
    24: {'Rouge': 'b', 'Jaune': 'd', 'Vert': 'a', 'Bleu':  'c'},
    25: {'Rouge': 'b', 'Jaune': 'c', 'Vert': 'd', 'Bleu':  'a'},
}

DESCRIPTION = {
    'Rouge': ('D - Dominance',
              'Direct, determine, oriente resultats, fonceur, competitif.'),
    'Jaune': ('I - Influence',
              'Sociable, enthousiaste, communicatif, optimiste, expressif.'),
    'Vert':  ('S - Stabilite',
              "Patient, loyal, stable, a l'ecoute, fiable, diplomate."),
    'Bleu':  ('C - Conformite',
              'Analytique, precis, methodique, reserve, rigoureux.'),
}

COULEUR_CONSOLE = {
    'Rouge': '\033[41m\033[97m',
    'Jaune': '\033[43m\033[30m',
    'Vert':  '\033[42m\033[97m',
    'Bleu':  '\033[44m\033[97m',
}
RESET = '\033[0m'
GRAS  = '\033[1m'


def _supporte_couleur():
    import sys, os
    if os.environ.get('NO_COLOR'):
        return False
    return sys.stdout.isatty()


COULEUR_OK = _supporte_couleur()


def colorer(texte, nom_couleur, gras=False):
    if not COULEUR_OK or nom_couleur not in COULEUR_CONSOLE:
        return texte
    prefixe = (GRAS if gras else '') + COULEUR_CONSOLE[nom_couleur]
    return f"{prefixe} {texte} {RESET}"


def badge_couleur(nom_couleur, score, dominant=False):
    contenu = f" {nom_couleur.upper()} : {score} "
    if COULEUR_OK:
        prefixe = (GRAS if dominant else '') + COULEUR_CONSOLE[nom_couleur]
        suffixe = RESET + (GRAS if dominant else '')
        return (f"+----------+\n"
                f"|{prefixe}{contenu:^10}{suffixe}|\n"
                f"+----------+")
    etoile = " *" if dominant else "  "
    return (f"+----------+\n"
            f"| {nom_couleur.upper():6} {score:>2}{etoile}|\n"
            f"+----------+")


def barre_score(score, max_score=25, largeur=30):
    rempli = int(round((score / max_score) * largeur)) if max_score else 0
    rempli = max(0, min(largeur, rempli))
    return '#' * rempli + '-' * (largeur - rempli)


def calculer_scores(choix):
    if len(choix) != 25:
        raise ValueError("Il faut exactement 25 choix (un par ligne).")

    scores = {'Rouge': 0, 'Jaune': 0, 'Vert': 0, 'Bleu': 0}
    detail = []

    for ligne, lettre in enumerate(choix, start=1):
        lettre = lettre.strip().lower()
        if lettre not in 'abcd':
            raise ValueError(f"Ligne {ligne} : choix invalide << {lettre} >>")

        couleur_trouvee = None
        for couleur, lettre_table in CLE_NOTATION[ligne].items():
            if lettre_table == lettre:
                scores[couleur] += 1
                couleur_trouvee = couleur
                break

        if couleur_trouvee is None:
            raise ValueError(
                f"Ligne {ligne} : la lettre << {lettre} >> ne correspond a "
                f"aucune couleur (erreur de table)."
            )
        detail.append((ligne, lettre, couleur_trouvee))

    return scores, detail


def afficher_resultats(scores):
    """Affiche le profil DISC avec les 4 couleurs bien mises en evidence
    et la couleur dominante clairement signalee."""

    print()
    print("=" * 60)
    print("         RESULTATS DU MINI TEST DISC")
    print("=" * 60)

    # ---------- 1) Les 4 badges colores en grand ----------
    print("\n[ Vos scores par couleur ]\n")
    badges = []
    for couleur in ['Rouge', 'Jaune', 'Vert', 'Bleu']:
        badges.append(badge_couleur(couleur, scores[couleur]))
    for lignes in zip(*[b.split('\n') for b in badges]):
        print('   '.join(lignes))

    # ---------- 2) Barres de progression detaillees ----------
    score_top = max(scores.values())
    nb_dominantes = sum(1 for v in scores.values() if v == score_top)

    print("\n[ Detail des scores ]\n")
    for couleur in ['Rouge', 'Jaune', 'Vert', 'Bleu']:
        score = scores[couleur]
        code_disc, _ = DESCRIPTION[couleur]
        est_dominant = (score == score_top and nb_dominantes == 1)
        marqueur = "   <-- DOMINANTE" if est_dominant else ""
        barre = barre_score(score)
        ligne = (f"  {couleur:6} ({code_disc:14})  {score:2}/25  "
                 f"|{barre}|{marqueur}")
        if COULEUR_OK:
            print(colorer(ligne, couleur, gras=est_dominant))
        else:
            print(ligne)

    # ---------- 3) Interpretation du profil ----------
    classement = sorted(scores.items(), key=lambda x: (-x[1], x[0]))
    dominante  = classement[0]
    secondaire = classement[1]

    print("\n" + "-" * 60)
    if COULEUR_OK:
        print(f"  >>> COULEUR DOMINANTE : "
              f"{colorer(dominante[0].upper() + '  (' + str(dominante[1]) + '/25)', dominante[0], gras=True)}")
    else:
        print(f"  >>> COULEUR DOMINANTE : {dominante[0].upper()}  ({dominante[1]}/25)")
    print(f"      {DESCRIPTION[dominante[0]][0]}")
    print(f"      -> {DESCRIPTION[dominante[0]][1]}")

    print(f"\n  >>> Couleur secondaire : {secondaire[0]} "
          f"({secondaire[1]}/25)  -  {DESCRIPTION[secondaire[0]][0]}")
    print(f"      -> {DESCRIPTION[secondaire[0]][1]}")

    code = dominante[0][0] + secondaire[0][0]
    if COULEUR_OK:
        print(f"\n  >>> Code de votre profil DISC : {GRAS}{code}{RESET}")
    else:
        print(f"\n  >>> Code de votre profil DISC : {code}")
    print("=" * 60)

    # ---------- 4) Resume express pour la personne ----------
    print("\n[ En resume ]\n")
    for couleur, score in classement:
        marqueur = "   <-- dominante" if couleur == dominante[0] else ""
        if COULEUR_OK:
            texte = couleur + " : " + str(score) + "/25" + marqueur
            print(f"  - {colorer(texte, couleur, gras=(couleur == dominante[0]))}")
        else:
            print(f"  - {couleur:5} : {score}/25 points{marqueur}")

    ecart = dominante[1] - secondaire[1]
    print(f"\n>>> Votre couleur dominante est {dominante[0].upper()} "
          f"avec un ecart de {ecart} point(s) sur la suivante.\n")


def demander_choix():
    """Demande interactivement les 25 choix a l'utilisateur."""
    print("\nEntrez vos 25 choix du Mini Test.")
    print("Pour chaque ligne, tapez a, b, c ou d.\n")

    choix = []
    for i in range(1, 26):
        reponse = input(f"  Ligne {i:2d} (a/b/c/d) : ").strip().lower()
        while reponse not in 'abcd':
            print("  Saisie invalide. Tapez a, b, c ou d.")
            reponse = input(f"  Ligne {i:2d} (a/b/c/d) : ").strip().lower()
        choix.append(reponse)
    return choix


if __name__ == "__main__":
    import sys

    # Mode 1 : python calcul_disc.py a b c d ... (25 lettres)
    if len(sys.argv) == 26:
        try:
            scores, _ = calculer_scores(sys.argv[1:])
            afficher_resultats(scores)
        except ValueError as e:
            print("Erreur :", e)
    # Mode 2 : saisie interactive
    else:
        choix = demander_choix()
        scores, _ = calculer_scores(choix)
        afficher_resultats(scores)
