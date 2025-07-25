from sklearn.ensemble import RandomForestClassifier
from joblib import dump
import numpy as np

X = np.array([
    # Normais
    [35, 50, 30],   # normal
    [45, 60, 25],   # normal
    [22, 10, 15],   # normal
    [85, 99, 45],   # normal
    [55, 70, 40],   # normal

    # Falhas: temperatura muito alta
    [95, 60, 30],
    [100, 80, 20],

    # Falhas: vibração alta
    [50, 150, 30],
    [60, 130, 25],

    # Falhas: pressão alta
    [60, 70, 60],
    [70, 80, 70],

    # Falhas combinadas
    [95, 120, 55],
    [100, 150, 65]
])

y = [  # Classes (0 = normal, 1 = falha)
    0, 0, 0, 0, 0,   # normais
    1, 1,            # temperatura fora
    1, 1,            # vibração fora
    1, 1,            # pressão fora
    1, 1             # tudo fora
]

# Treinar o modelo
modelo = RandomForestClassifier()
modelo.fit(X, y)

# Salvar o modelo treinado
dump(modelo, 'modelo.pkl')
print("✔ Modelo treinado e salvo com sucesso!")
