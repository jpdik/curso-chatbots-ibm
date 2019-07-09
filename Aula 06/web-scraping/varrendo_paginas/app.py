#coding: utf-8

from bs4 import BeautifulSoup
import requests
import re
import json

baseURL = 'https://www.tastemade.com.br'
searchURL = '/receitas'

data = {}

receitas = []

def requisitar_pagina(url):
    req = requests.get(url)

    return req.text

def return_recipe_model(recipe):
    if recipe.h2:
        return recipe.h2.text
    elif recipe.h1:
        return recipe.h1.text
    elif recipe.span:
        return recipe.span.text
    return recipe

def return_recipe_ingredients(recipe):
    ingredients = []
    for ingredient in recipe.find('ul', class_=re.compile(r'VideoRecipe__ColumnList')).find_all('li'):
        ingredients.append(ingredient.p.text)
    return ingredients

def return_recipe_instructions(recipe):
    instructions = []
    for instruct in recipe.find('ol', class_=re.compile(r'VideoRecipe__List')).find_all('li'):
        instructions.append(instruct.p.text)
    return instructions

def obter_receita(link, pagina):
    receita = {}
    soup = BeautifulSoup(pagina, 'html.parser')
    receita['link'] = link
    for recipe in soup.find_all("div", class_=re.compile(r'VideoRecipe__Container')):
        receita['nome'] = return_recipe_model(recipe)
        receita['ingredientes'] = return_recipe_ingredients(recipe)
        receita['instrucoes'] = return_recipe_instructions(recipe)
        receitas.append(receita)

def obter_lista_receitas(pagina):
    soup = BeautifulSoup(pagina, 'html.parser')
    for card in soup.find_all("div", class_=re.compile(r'MediaCard__InfoContainer')):
        receita = card.a.get('href')
        obter_receita(baseURL + receita, requisitar_pagina(baseURL + receita))

def obter_categorias(pagina):
    soup = BeautifulSoup(pagina, 'html.parser')
    for card in soup.find_all("div", class_=re.compile(r'MediaLandscapePoster__ThumbWrapper'))[:-1]:
        categoria = card.a.get('href')
        obter_lista_receitas(requisitar_pagina(baseURL + categoria))

obter_categorias(requisitar_pagina(baseURL + searchURL))

data['receitas'] = receitas

with open('data.json', 'w') as outfile:  
    json.dump(data, outfile, indent=4, ensure_ascii=False)