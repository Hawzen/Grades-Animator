import pandas as pd
from numpy import array
import sys

def get_grades(html_path):
    res = pd.read_html(html_path)
    
    tables = []
    correct_index = pd.Index(['رمز المقرر', 'اسم المقرر', 'الساعات', 'النقاط', 'التقدير'], dtype='object')
    for table in res:
        if len(table.columns) == len(correct_index) and (table.columns == correct_index).all():
            tables.append(table)
    
    preprocessed_tables = []
    empty_row = array(['رمز المقرر', 'اسم المقرر', 'الساعات', 'النقاط', 'التقدير'], dtype=object)
    for table in tables:
        table = table.dropna()
        table = table[~(table == empty_row).all(axis=1)]
        if len(table) == 0 or 0 not in table.index:
            continue
        preprocessed_tables.append(table)

    for i, _ in enumerate(preprocessed_tables):
        preprocessed_tables[i]["الترم"] = len(preprocessed_tables) - i
        
    return pd.concat(preprocessed_tables[::-1]).reset_index(drop=True)


if __name__ == "__main__":
    df = get_grades(sys.argv[1])
    json = df.to_json()
    with open("data.json", "w") as file:
        file.write(f'data = "{json}"')