import pandas as pd
import numpy as np

# with open("webmd_part.csv") as f:
#     for row in f:
#         print(row)

def remove_non_ascii(text):
    return ''.join([i for i in text if ord(i)<128])

MainFile = pd.read_excel("data/webmd_whole.xlsx")
#print(a['Condition'])
MainFile = MainFile.drop('Reviews', 1)
MainFile = MainFile.replace(r'^\s*$', "NULL", regex=True)
print(MainFile.columns)
# for col in MainFile:
#     print(MainFile.dtypes[col])

#MainFile.to_csv('data/webMD_part5.csv', index = False, header=True, sep = '~')
# for Col in MainFile:
#     if (MainFile.dtypes[col] == "object"):
#         #MainFile[Col] = MainFile[Col].str.encode('utf-8', 'ignore').str.decode('utf-8')
#         MainFile[Col] = MainFile[Col].apply(remove_non_ascii)
#     partFile = MainFile[Col]
#     partFile.to_csv('data/'+Col+'.csv', index = False, header=False)
