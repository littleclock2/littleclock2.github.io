# MSPM0 LC 表设计

## 项目简介

基于 TI MSPM0 MCU 设计的高精度 LC 表，可测量电感和电容值。

## 技术指标

- 电感测量范围: 1nH - 100mH
- 电容测量范围: 1pF - 100uF
- 测量精度: ±1%

## 硬件设计

### 测量原理

采用谐振频率法：
- LC 振荡电路产生谐振频率
- 通过测量频率计算 L 或 C 值
- 频率 = 1 / (2π√LC)

### 电路设计

使用 MSPM0 的比较器和定时器实现高精度频率测量。

## 软件实现

```c
// LC 表核心算法
float calculate_LC(float freq, float C_known) {
    float LC = 1.0 / (2 * PI * freq);
    LC = LC * LC;
    return LC / C_known;
}
```

## 校准方法

使用已知精度的参考电容进行校准，通过两点校准消除系统误差。

## 项目链接

[MSPM0-Projects](https://github.com/littleclock2/MSPM0-Projects)
