result = []
for i in input().split()[::-1]:
    if i.isdigit() or i in "+-*/":
        result.append(int(i))
    elif i == "+":
        result.append(result.pop() + result.pop())
    elif i == "*":
        result.append(result.pop() * result.pop())
    elif i == "-":
        result.append(result.pop() - result.pop())
    elif i == "/":
        result.append(result.pop() / result.pop())
    else:
        print("Input error")
        err = True
        break

if not err:
    print(result[0])
