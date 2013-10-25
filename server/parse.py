"""
Parse the input file and create a generator that returns country data
"""
import sys
import xlrd


class ProfileParser(object):
    row_start = 1
    col_code = 3
    row_country = 1

    def __init__(self, filename):
        self.workbook = xlrd.open_workbook(filename)
        self.worksheet = self.workbook.sheet_by_index(0)

    def process_country(self, col):
        country_name = self.worksheet.cell_value(ProfileParser.row_country, col)
        values = {}
        for row in range(ProfileParser.row_start, self.worksheet.nrows):
            code = self.worksheet.cell_value(row, ProfileParser.col_code)
            if not code:
                next
            value = self.worksheet.cell_value(row, col)
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

    def parse_profiles(self):
        for idx in range(3, self.worksheet.ncols):
            yield self.process_country(idx)

class IHMEParser(object):
    row_start = 1
    col_country = 1
    col_cause = 4
    col_rank = 5
    col_perc = 6

    def __init__(self, filename):
        self.workbook = xlrd.open_workbook(filename)
        self.worksheet = self.workbook.sheet_by_index(0)

    def parse_data(self):
        for row in range(IHMEParser.row_start, self.worksheet.nrows):
            country = self.worksheet.cell_value(row, IHMEParser.col_country)
            rank = int(self.worksheet.cell_value(row, IHMEParser.col_rank))
            cause = self.worksheet.cell_value(row, IHMEParser.col_cause)
            perc = self.worksheet.cell_value(row, IHMEParser.col_perc)
            yield {
                "country" : country,
                "rank" : rank,
                "cause" : cause,
                "perc" : perc,
                "code" : "daly_%d" % rank
            }

    

if __name__ == "__main__":
    parser = IHMEParser(sys.argv[1])
    parser.parse_data()


