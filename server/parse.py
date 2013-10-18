"""
Parse the input file and create a generator that returns country data
"""
import sys
import xlrd

col_code = 3
row_start = 1
row_country = 1

worksheet = None
workbook = None

def process_country(col):
    country_name = worksheet.cell_value(row_country, col)
    values = {}
    for row in range(row_start, worksheet.nrows):
        code = worksheet.cell_value(row, col_code)
        if not code:
            next
        value = worksheet.cell_value(row, col)
        if type(value) == unicode:
            itemized = [i.strip() for i in value.split(';')]
            if len(itemized) == 1:
                values[code] = itemized[0]
            else:
                for i, v in enumerate(itemized):
                    values['%s_%d' % (code, i)] = v
        elif type(value) == float:
            values[code] = '%.3g' % (value)
        else:
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


