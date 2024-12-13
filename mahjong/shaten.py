class MahjongShanten:
    def __init__(self):
        self.hand = [0] * 38
        self.complete_sets = 0
        self.pair = 0
        self.partial_sets = 0
        self.best_shanten = 8
        self.minimum_shanten = -2
        self.has_given_minimum = False

    def calculate_minimum_shanten(self, hand_to_check, minimum_shanten=-2):
        """计算手牌的最小向听数，考虑标准和牌、七对子和国士无双"""
        # 转换为手牌数组
        self.hand = hand_to_check[:]
        
        # 计算七对子向听数
        chiitoi_shanten = self.calculate_chiitoi_shanten()
        if chiitoi_shanten < 0:
            return chiitoi_shanten

        # 计算国士无双向听数
        kokushi_shanten = self.calculate_kokushi_shanten()
        if kokushi_shanten < 3:
            return kokushi_shanten

        # 计算标准和牌向听数
        standard_shanten = self.calculate_standard_shanten(minimum_shanten)

        return min(standard_shanten, chiitoi_shanten, kokushi_shanten)

    def calculate_chiitoi_shanten(self):
        """计算七对子向听数"""
        pair_count = 0
        unique_tiles = 0

        for i in range(1, len(self.hand)):
            if self.hand[i] == 0:
                continue

            unique_tiles += 1
            if self.hand[i] >= 2:
                pair_count += 1

        shanten = 6 - pair_count
        if unique_tiles < 7:
            shanten += 7 - unique_tiles

        return shanten

    def calculate_kokushi_shanten(self):
        """计算国士无双向听数"""
        unique_tiles = 0
        has_pair = 0

        terminals = [1, 9, 11, 19, 21, 29, 31, 32, 33, 34, 35, 36, 37]
        for i in terminals:
            if self.hand[i] > 0:
                unique_tiles += 1
                if self.hand[i] >= 2:
                    has_pair = 1

        return 13 - unique_tiles - has_pair

    def calculate_standard_shanten(self, minimum_shanten_=-2):
        """计算标准和牌向听数"""
        self.complete_sets = 0
        self.pair = 0
        self.partial_sets = 0
        self.best_shanten = 8
        
        self.has_given_minimum = True
        self.minimum_shanten = minimum_shanten_
        
        if minimum_shanten_ == -2:
            self.has_given_minimum = False
            self.minimum_shanten = -1

        # 检查所有可能的对子
        for i in range(1, len(self.hand)):
            if self.hand[i] >= 2:
                self.pair += 1
                self.hand[i] -= 2
                self.remove_completed_sets(1)
                self.hand[i] += 2
                self.pair -= 1

        # 检查没有对子的情况
        self.remove_completed_sets(1)

        return self.best_shanten

    def remove_completed_sets(self, i):
        """移除所有可能的完整面子"""
        if self.best_shanten <= self.minimum_shanten:
            return

        # 跳过手牌中不存在的牌
        while i < len(self.hand) and self.hand[i] == 0:
            i += 1

        if i >= len(self.hand):
            self.remove_potential_sets(1)
            return

        # 检查刻子
        if self.hand[i] >= 3:
            self.complete_sets += 1
            self.hand[i] -= 3
            self.remove_completed_sets(i)
            self.hand[i] += 3
            self.complete_sets -= 1

        # 检查顺子
        if i < 30 and self.hand[i+1] > 0 and self.hand[i+2] > 0:
            self.complete_sets += 1
            self.hand[i] -= 1
            self.hand[i+1] -= 1
            self.hand[i+2] -= 1
            self.remove_completed_sets(i)
            self.hand[i] += 1
            self.hand[i+1] += 1
            self.hand[i+2] += 1
            self.complete_sets -= 1

        # 检查其他可能的组合
        self.remove_completed_sets(i + 1)

    def remove_potential_sets(self, i):
        """移除所有可能的搭子"""
        if self.best_shanten <= self.minimum_shanten:
            return

        if (self.has_given_minimum and 
            self.complete_sets < 3 - self.minimum_shanten):
            return

        while i < len(self.hand) and self.hand[i] == 0:
            i += 1

        if i >= len(self.hand):
            current_shanten = 8 - (self.complete_sets * 2) - self.partial_sets - self.pair
            if current_shanten < self.best_shanten:
                self.best_shanten = current_shanten
            return

        if self.complete_sets + self.partial_sets < 4:
            # 检查对子
            if self.hand[i] == 2:
                self.partial_sets += 1
                self.hand[i] -= 2
                self.remove_potential_sets(i)
                self.hand[i] += 2
                self.partial_sets -= 1

            # 检查两面搭子
            if i < 30 and self.hand[i+1] > 0:
                self.partial_sets += 1
                self.hand[i] -= 1
                self.hand[i+1] -= 1
                self.remove_potential_sets(i)
                self.hand[i] += 1
                self.hand[i+1] += 1
                self.partial_sets -= 1

            # 检查坎张搭子
            if i < 30 and i % 10 <= 8 and self.hand[i+2] > 0:
                self.partial_sets += 1
                self.hand[i] -= 1
                self.hand[i+2] -= 1
                self.remove_potential_sets(i)
                self.hand[i] += 1
                self.hand[i+2] += 1
                self.partial_sets -= 1

        # 检查其他可能的组合
        self.remove_potential_sets(i + 1)

def convert_hand_string(hand_str):
    """将字符串格式的手牌转换为数组格式
    例如: "1m4m7m3p6p9p2s5s8s1z2z2z3z4z" -> [0,1,0,0,1,0,0,1,0,0, ...]
    """
    hand = [0] * 38
    
    # 按两个字符一组进行处理
    tiles = [hand_str[i:i+2] for i in range(0, len(hand_str), 2)]
    
    for tile in tiles:
        if len(tile) != 2:  # 处理可能的不完整输入
            continue
            
        num = int(tile[0])
        suit = tile[1]
        
        # 根据花色确定基础位置
        base = 0
        if suit == 'm':
            base = 1
        elif suit == 'p':
            base = 11
        elif suit == 's':
            base = 21
        elif suit == 'z':
            base = 31
        
        # 计算索引并增加计数
        idx = base + num - 1 if suit != 'z' else base + num - 1
        hand[idx] += 1
    
    return hand

def tile_to_index(tile_str):
    """将牌的字符串表示转换为数组索引"""
    if len(tile_str) != 2:
        raise ValueError("Invalid tile format")
        
    number = int(tile_str[0])
    suit = tile_str[1].lower()
    
    if suit == 'm':  # 万子
        return number
    elif suit == 'p':  # 筒子
        return number + 10
    elif suit == 's':  # 索子
        return number + 20
    else:
        raise ValueError(f"Invalid suit: {suit}")

def update_hand_after_move(hand, move):
    """根据玩家动作更新手牌"""
    # 动作格式：9p-3s (打出9p摸入3s)
    if not move or '-' not in move:
        return False
        
    discard, draw = move.split('-')
    
    # 将牌的表示转换为数组索引
    discard_index = tile_to_index(discard)
    draw_index = tile_to_index(draw)
    
    # 验证动作合法性
    if discard_index < 1 or discard_index >= len(hand) or hand[discard_index] <= 0:
        print(f"错误：没有可以打出的{discard}")
        return False
        
    # 更新手牌
    hand[discard_index] -= 1
    hand[draw_index] += 1
    return True

def clear_screen():
    """清除控制台内容"""
    import os
    os.system('cls' if os.name == 'nt' else 'clear')

def hand_to_string(hand):
    """将手牌数组转换为字符串表示"""
    result = []
    # 万子
    mans = []
    for i in range(1, 10):
        mans.extend([f"{i}m"] * hand[i])
    if mans:
        result.extend(mans)
    
    # 筒子
    pins = []
    for i in range(1, 10):
        pins.extend([f"{i}p"] * hand[i + 10])
    if pins:
        result.extend(pins)
    
    # 索子
    sous = []
    for i in range(1, 10):
        sous.extend([f"{i}s"] * hand[i + 20])
    if sous:
        result.extend(sous)
        
    return "".join(result)

def index_to_tile(index):
    """将牌的索引转换为可读的字符串"""
    if index < 1 or index > 37:
        return "错误"
        
    number = (index - 1) % 10 + 1
    if index <= 10:
        return f"{number}万"
    elif index <= 20:
        return f"{number}饼"
    elif index <= 30:
        return f"{number}索"
    else:
        zi = ["", "东", "南", "西", "北", "白", "发", "中"]
        return zi[number]

def calculate_waiting_tiles(hand):
    """计算听牌时的进张"""
    waiting_tiles = []
    calculator = MahjongShanten()
    
    # 遍历所有可能的牌
    for i in range(1, 38):
        # 跳过无效的牌位置（万子、饼子、索子只有1-9）
        if (i % 10 == 0) or (i > 37):  # 跳过10位和超过37的位置
            continue
        
        # 跳过已经有4张的牌
        if hand[i] >= 4:
            continue
            
        # 模拟摸到这张牌
        hand[i] += 1
        # 计算加入这张牌后的向听数
        shanten = calculator.calculate_minimum_shanten(hand)
        # 如果向听数为-1，说明这张牌可以和牌
        if shanten == -1:
            waiting_tiles.append(i)
        # 恢复手牌
        hand[i] -= 1
    
    return waiting_tiles

def count_remaining_tiles(hand, tile_index):
    """计算某张牌还剩余的枚数（假设每张牌最多4枚）"""
    return 4 - hand[tile_index]

def analyze_hand(hand, last_action=None):
    """分析当前手牌状态"""
    clear_screen()  # 清除上一次的分析结果
    
    # 显示当前手牌
    current_hand = hand_to_string(hand)
    print(f"当前手牌: {current_hand}")
    if last_action:
        print(f"上一步操作: {last_action}")
    calculator = MahjongShanten()
    
    # 计算当前向听数
    current_shanten = calculator.calculate_minimum_shanten(hand)
    print(f"\n当前向听数: {current_shanten}")
    
    # 如果是听牌，显示进张
    if current_shanten == 0:
        # 分析所有可能的打牌选择
        best_discards = []
        for i in range(1, len(hand)):
            if hand[i] > 0:
                # 模拟打出这张牌
                hand[i] -= 1
                waiting_tiles = calculate_waiting_tiles(hand)
                if waiting_tiles:
                    total_tiles = 0
                    for tile_idx in waiting_tiles:
                        remaining = count_remaining_tiles(hand, tile_idx)
                        total_tiles += remaining
                    best_discards.append((i, total_tiles, waiting_tiles))
                hand[i] += 1  # 恢复手牌
        
        # 按照进张数排序
        best_discards.sort(key=lambda x: -x[1])  # 按总进张数降序排序
        
        print("\n听牌分析:")
        if best_discards:
            for discard_idx, total_tiles, waiting_tiles in best_discards:
                print(f"\n打{index_to_tile(discard_idx)}:")
                print("  进张:")
                for tile_idx in waiting_tiles:
                    remaining = count_remaining_tiles(hand, tile_idx)
                    print(f"    {index_to_tile(tile_idx)}: {remaining}张")
                print(f"  总计: {total_tiles}张")
        else:
            print("没有合适的打牌选择")
    
    # 分析每种打牌的效果
    print("\n打牌后的分析:")
    for i in range(1, len(hand)):
        if hand[i] > 0:
            potential_draws = simulate_draw_after_discard(hand, i)
            if not potential_draws:
                continue
                
            tile_name = index_to_tile(i)
            print(f"\n打{tile_name}: ")
            
            if potential_draws:
                total_tiles = sum(rem for _, _, rem, _ in potential_draws)
                print(f"  期待摸到:")
                for tile_idx, shanten, remaining, next_draws in potential_draws:
                    next_draws_str = ""
                    if next_draws:
                        next_draws_str = "，期待摸到：" + "，".join(
                            f"{index_to_tile(next_idx)}：{next_rem}张" 
                            for next_idx, next_rem in next_draws
                        )
                    print(f"    {index_to_tile(tile_idx)}: {remaining}张 -> 向听数{shanten}{next_draws_str}")
                print(f"  总计: {total_tiles}张")

def get_next_draws(hand, tile_index):
    """计算摸到某张牌后的下一层期待进张"""
    calculator = MahjongShanten()
    next_draws = []
    
    # 模拟摸到这张牌
    hand[tile_index] += 1
    base_shanten = calculator.calculate_minimum_shanten(hand)
    
    # 遍历所有可能摸到的牌
    for i in range(1, 38):
        # 跳过无效的牌位置
        if (i % 10 == 0) or (i > 37):
            continue
            
        # 跳过已经有4张的牌
        if hand[i] >= 4:
            continue
            
        # 模拟摸到下一张牌
        hand[i] += 1
        shanten = calculator.calculate_minimum_shanten(hand)
        # 只记录能减少向听数的牌
        if shanten < base_shanten:
            remaining = 4 - (hand[i] - 1)
            if remaining > 0:
                next_draws.append((i, remaining))
        hand[i] -= 1
    
    # 恢复手牌
    hand[tile_index] -= 1
    
    return next_draws

def simulate_draw_after_discard(hand, discard_index):
    """模拟打出一张牌后，计算摸到每种牌后的最佳向听数"""
    calculator = MahjongShanten()
    potential_draws = []
    
    # 计算打出后的向听数基准值
    base_shanten = calculator.calculate_minimum_shanten(hand)
    # 打出选定的牌
    hand[discard_index] -= 1
    

    # 遍历所有可能摸到的牌
    for i in range(1, 38):
        # 跳过无效的牌位置
        if (i % 10 == 0) or (i > 37):
            continue
            
        # 跳过已经有4张的牌
        if hand[i] >= 4:
            continue
            
        # 模拟摸到这张牌
        hand[i] += 1
        # 计算加入这张牌后的向听数
        shanten = calculator.calculate_minimum_shanten(hand)
        # 如果向听数减少，记录这张牌
        if shanten < base_shanten:
            remaining = 4 - (hand[i] - 1)  # 修正剩余牌数计算
            if remaining > 0:
                # 计算摸到这张牌后的下一层期待进张
                next_draws = get_next_draws(hand, i)
                potential_draws.append((i, shanten, remaining, next_draws))
        # 恢复手牌
        hand[i] -= 1
    
    # 恢复手牌
    hand[discard_index] += 1
    
    # 按向听数排序，只返回能改善向听数的牌
    return sorted(potential_draws, key=lambda x: (x[1], -x[2]))

def main():
    # 创建向听数计算器实例
    calculator = MahjongShanten()
    
    # 获取初始手牌
    while True:
        try:
            hand_str = input("请输入初始手牌(格式如1m1m2p4p7p8p9p1s8s8s3p5p8s3p): ").strip()
            hand = convert_hand_string(hand_str)
            if sum(hand) == 14:  # 验证手牌数量
                break
            else:
                print("错误：手牌数量必须为14张")
        except Exception as e:
            print(f"输入格式错误，请重试: {str(e)}")
    
    # 打印初始手牌
    print(f"\n手牌: {hand_str}")
    
    # 分析初始手牌
    analyze_hand(hand, None)
    
    # 进入交互循环
    while True:
        print("\n请输入动作(格式如9p-3s表示打9p摸3s，或输入exit退出):")
        move = input().strip()
        
        if move.lower() == 'exit':
            break
            
        # 更新手牌
        if update_hand_after_move(hand, move):
            # 分析新的手牌状态
            analyze_hand(hand, move)
        else:
            print("动作格式错误，请使用正确的格式（如9p-3s）")

if __name__ == "__main__":
    main()