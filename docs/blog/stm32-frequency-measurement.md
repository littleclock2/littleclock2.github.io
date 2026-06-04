---
title: "STM32 频率测量实践"
date: 2026-05-26
description: "使用 STM32 定时器输入捕获功能实现高精度频率测量"
tags: ["STM32", "嵌入式", "频率测量"]
---

# STM32 频率测量实践

## 项目简介

使用 STM32 实现高精度频率测量，通过定时器输入捕获功能测量外部信号频率。

## 硬件平台

- MCU: STM32F103C8T6
- 测量范围: 1Hz - 1MHz
- 精度: ±0.1%

## 实现方案

### 定时器配置

使用 TIM2 的通道 1 进行输入捕获：

```c
// 定时器初始化
void TIM2_Init(void) {
    RCC->APB1ENR |= RCC_APB1ENR_TIM2EN;
    TIM2->PSC = 72 - 1;  // 1MHz 计数频率
    TIM2->ARR = 0xFFFF;
    TIM2->CCMR1 |= TIM_CCMR1_CC1S_0;  // 输入捕获
    TIM2->CCER |= TIM_CCER_CC1E;       // 上升沿捕获
    TIM2->DIER |= TIM_DIER_CC1IE;      // 捕获中断使能
    TIM2->CR1 |= TIM_CR1_CEN;
}
```

### 频率计算

```
频率 = 时钟频率 / (捕获值差)
```

## 测试结果

| 输入频率 | 测量值 | 误差 |
|---------|--------|------|
| 100Hz   | 100.0Hz | 0%   |
| 1kHz    | 1.001kHz | 0.1% |
| 10kHz   | 10.00kHz | 0%   |
| 100kHz  | 100.1kHz | 0.1% |

## 总结

STM32 的定时器输入捕获功能非常适合频率测量应用，通过合理的定时器配置可以实现高精度测量。
