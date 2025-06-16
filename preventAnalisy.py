import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from joblib import dump

# 1. Simular dados de sensores
data = {
    'temperatura': [35, 40, 42, 60, 70, 75, 30, 33, 34, 65],
    'vibracao': [100, 110, 115, 180, 200, 220, 90, 95, 85, 210],
    'ruido': [70, 72, 73, 85, 95, 98, 68, 66, 65, 92],
    'falha': [0, 0, 0, 1, 1, 1, 0, 0, 0, 1]  # 0 = OK, 1 = falha
}

df = pd.DataFrame(data)

# 2. Separar entrada e saída
X = df[['temperatura', 'vibracao', 'ruido']]
y = df['falha']

# 3. Treinar modelo
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
modelo = RandomForestClassifier()
modelo.fit(X_train, y_train)

# 4. Salvar modelo treinado
dump(modelo, 'modelo.pkl')

print("Modelo treinado e salvo como modelo.pkl")
