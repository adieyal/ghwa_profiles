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
    color_comm = "#ababab"
    color_non = "#121212"
    color_injury = "#343434"

    cause_colors = {
        "Alzheimer's disease and other dementias" : color_non,
        "Anxiety disorders" : color_non,
        "Asthma" : color_non,
        "Cardiomyopathy and myocarditis" : color_non,
        "Cerebrovascular disease" : color_non,
        "Chronic kidney diseases" : color_non,
        "Chronic obstructive pulmonary disease" : color_non,
        "Cirrhosis of the liver" : color_non,
        "Colon and rectum cancers" : color_non,
        "Congenital anomalies" : color_non,
        "Diabetes mellitus" : color_non,
        "Diarrheal diseases" : color_comm,
        "Drowning" : color_injury,
        "Drug use disorders" : color_injury,
        "Falls" : color_injury,
        "HIV/AIDS" : color_comm,
        "Interpersonal violence" : color_injury,
        "Iron-deficiency anemia" : color_comm,
        "Ischemic heart disease" : color_non,
        "Liver cancer" : color_non,
        "Low back pain" : color_non,
        "Lower respiratory infections" : color_comm,
        "Major depressive disorder" : color_non,
        "Malaria" : color_comm,
        "Meningitis" : color_comm,
        "Neck pain" : color_non,
        "Neonatal encephalopathy (birth asphyxia and birth trauma)" : color_comm,
        "Other musculoskeletal disorders" : color_non,
        "Preterm birth complications" : color_comm,
        "Protein-energy malnutrition" : color_comm,
        "Road injury" : color_injury,
        "Self-harm" : color_injury,
        "Sepsis and other infectious disorders of the newborn baby" : color_comm,
        "Syphilis" : color_comm,
        "Trachea, bronchus, and lung cancers" : color_non,
        "Tuberculosis" : color_comm,
        "Stomach cancer" : color_non,
        "Maternal disorders" : color_comm,
        "Tetanus" : color_comm,
        "Collective violence and legal intervention" : color_injury,
        "Exposure to mechanical forces" : color_injury,
        "Migraine" : color_non,
        "Breast cancer" : color_non,
    }

    def __init__(self, filename):
        self.workbook = xlrd.open_workbook(filename)
        self.worksheet = self.workbook.sheet_by_index(0)

    def parse_data(self):
        for row in range(IHMEParser.row_start, self.worksheet.nrows):
            country = self.worksheet.cell_value(row, IHMEParser.col_country)
            rank = int(self.worksheet.cell_value(row, IHMEParser.col_rank))
            cause = self.worksheet.cell_value(row, IHMEParser.col_cause)
            perc = self.worksheet.cell_value(row, IHMEParser.col_perc)
            if rank > 10: continue
            yield {
                "country" : country,
                "rank" : rank,
                "cause" : cause,
                "perc" : perc,
                "code" : "daly_%d" % rank,
                "color" : IHMEParser.cause_colors[cause],
            }
    

if __name__ == "__main__":
    parser = IHMEParser(sys.argv[1])
    parser.parse_data()


