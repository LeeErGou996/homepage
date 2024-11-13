import json

def filter_and_remove_pronouns(input_filename, output_filename):
    # 读取 JSON 文件
    with open(input_filename, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    # 筛选出“category”为“代词”的条目
    pronouns = [entry for entry in data if entry.get("type") == "副词"]
    
    # 从原数据中删除“代词”条目
    data = [entry for entry in data if entry.get("type") != "副词"]
    
    # 将筛选出的“代词”条目保存到新的 JSON 文件中
    with open(output_filename, 'w', encoding='utf-8') as file:
        json.dump(pronouns, file, ensure_ascii=False, indent=4)
    
    # 将删除代词后的数据重新写回原文件
    with open(input_filename, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
    
    print(f"筛选出的代词已保存到 {output_filename} 文件中，并从原文件中删除。")

# 使用示例
input_filename = "words.json"      # 输入文件名
output_filename = "advs.json"  # 输出文件名
filter_and_remove_pronouns(input_filename, output_filename)

