"""
Parse the input file and create a generator that returns country data
"""
import sys
import xlrd

col_code = 3
row_start = 3
row_country = 1

worksheet = None
workbook = None

def process_country(col):
    country_name = worksheet.cell_value(row_country, col)
    values = {}
    for row in range(row_start, worksheet.nrows):
        code = worksheet.cell_value(row, col_code)
        value = worksheet.cell_value(row, col)
        values[code] = value
    return country_name, values

def parse(filename):
    global worksheet, workbook

    workbook = xlrd.open_workbook(filename)
    worksheet = workbook.sheet_by_index(0)

    for idx in range(3, worksheet.ncols):
        yield process_country(idx)

if __name__ == "__main__":
    import pdb; pdb.set_trace()
    parse(sys.argv[1])


