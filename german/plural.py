import json

def get_plural_form(word):
    """
    根据德语名词的特征确定其复数形式
    返回格式为 "(die, PLURAL_SUFFIX)"
    """
    # 分离冠词和名词
    parts = word.split()
    if len(parts) != 2:
        return "(plural form unknown)"
    
    article, noun = parts
    
    # 针对不同词性的复数规则
    if article == "die":
        # 阴性名词复数规则
        if noun.endswith(('e',)):
            return "(die, -n)"
        elif noun.endswith('in'):
            return "(die, -nen)"
        elif noun.endswith(('ung', 'heit', 'keit', 'ion', 'tät', 'schaft')):
            return "(die, -en)"
        elif noun.endswith(('a',)):
            return "(die, -en)"
        else:
            return "(die, -en)"
            
    elif article == "der":
        # 阳性名词复数规则
        if noun.endswith('er'):
            return "(die, -)"  # 不变
        elif noun.endswith('en'):
            return "(die, -)"  # 不变
        elif noun.endswith(('ant', 'ist', 'or')):
            return "(die, -en)"
        elif noun.endswith('e'):
            return "(die, -n)"
        else:
            return "(die, -en)"
            
    elif article == "das":
        # 中性名词复数规则
        if noun.endswith(('chen', 'lein')):
            return "(die, -)"  # 不变
        elif noun.endswith('um'):
            return "(die, -en)"
        elif noun.endswith('ma'):
            return "(die, -men)"
        elif noun.endswith(('nis',)):
            return "(die, -se)"
        else:
            return "(die, -)"  # 默认不变
            
    return "(plural form unknown)"

# 读取JSON文件
with open('nouns.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 处理每个单词
for item in data:
    original_word = item['word']
    plural_form = get_plural_form(original_word)
    item['word'] = f"{original_word} {plural_form}"

# 保存修改后的数据
with open('nouns_with_plural.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# 打印一些示例进行验证
print("示例输出:")
for item in data[:10]:
    print(f"{item['word']}")