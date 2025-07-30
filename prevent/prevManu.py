import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from joblib import dump

np.random.seed(42)  # para resultados reproduzíveis

# Gerar dados simulados
n = 50
data = pd.DataFrame({
    'dias_uso_total': np.random.randint(50, 1000, size=n),
    'horas_dia': np.random.randint(1, 12, size=n),
    'ultima_manutencao_dias': np.random.randint(1, 100, size=n),
    'trocou_peca': np.random.choice([0,1], size=n),
    'falha_recente': np.random.choice([0,1], size=n),
})

# Criar target com alguma relação linear + ruído
data['dias_ate_proxima_manutencao'] = (
    100 
    - 0.05 * data['dias_uso_total'] 
    - 1.5 * data['horas_dia'] 
    - 0.3 * data['ultima_manutencao_dias'] 
    + 10 * data['trocou_peca'] 
    - 15 * data['falha_recente'] 
    + np.random.normal(0, 5, size=n)  # ruído gaussiano
).astype(int)

# Separar features e target
X = data.drop('dias_ate_proxima_manutencao', axis=1)
y = data['dias_ate_proxima_manutencao']

# Treinar o modelo com 40% para teste
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.4, random_state=42)

modelo = LinearRegression()
modelo.fit(X_train, y_train)

# Avaliar
y_pred = modelo.predict(X_test)
print("MAE:", mean_absolute_error(y_test, y_pred))
print("R²:", r2_score(y_test, y_pred))

# Salvar modelo
dump(modelo, 'modeloRegreMan.pkl')
