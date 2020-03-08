"""
Este módulo deve ser rodado por redirecionamento de entrada passando o arquivo com
os aeroportos onde cada linha tem o formato: SIGLA LATITUDE LONGITUDE

A saída será o preço das passagens entre os aeroportos gerados de forma aleatória
onde cada linha tem o formato: SIGLA1 SIGLA2 PREÇO
"""

from itertools import combinations
import random

quantidade_de_entradas = int(input())
siglas = []

for i in range(quantidade_de_entradas):
    siglas.append(input().split()[0])

combinacoes = combinations(siglas, 2)
n = quantidade_de_entradas
print( int(n * (n - 1) / 2) )

for sigla1, sigla2 in combinacoes:
    print(f'{"//" if random.randint(0, 1) == 0 else ""}{sigla1} {sigla2} {random.randint(200, 2000)}')
