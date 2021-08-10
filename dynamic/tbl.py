seq1 = "abcabc"
seq2 = "acbacb"



table = [[0]*(len(seq1)+1)]

for k in range(len(seq2)):
    table.append([0])
print(*table, sep="\n")

for i in range(1, len(seq1)+1):
    for j in range(1, len(seq2)+1):
        pass
