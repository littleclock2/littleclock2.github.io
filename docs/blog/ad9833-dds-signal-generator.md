# AD9833 DDS 信号发生器

## 项目简介

基于 AD9833 DDS 芯片的信号发生器，支持正弦波、方波、三角波输出。

## 技术规格

- 输出频率范围: 0Hz - 12.5MHz
- 分辨率: 0.1Hz
- 输出波形: 正弦波、方波、三角波
- 幅度: 0-3.3V 可调

## 硬件设计

### AD9833 介绍

AD9833 是 ADI 公司的低功耗 DDS 芯片：
- 28 位相位累加器
- 内置 DAC
- SPI 接口控制

### 电路连接

```
MSPM0          AD9833
SCLK  ------>  SCLK
MOSI  ------>  SDATA
CS    ------>  FSYNC
GPIO  ------>  RESET
```

## 软件实现

### SPI 通信

```c
void AD9833_WriteWord(uint16_t data) {
    CS_LOW();
    for(int i = 15; i >= 0; i--) {
        SCLK_LOW();
        if(data & (1 << i))
            MOSI_HIGH();
        else
            MOSI_LOW();
        SCLK_HIGH();
    }
    CS_HIGH();
}
```

### 频率设置

```c
void AD9833_SetFrequency(float freq) {
    uint32_t freq_word = (uint32_t)(freq * POW2_28 / MCLK);
    AD9833_WriteWord(0x2000);  // 控制字
    AD9833_WriteWord(freq_word & 0x3FFF);  // LSB
    AD9833_WriteWord((freq_word >> 14) | 0x4000);  // MSB
}
```

## 测试结果

使用示波器验证输出波形，频率精度达到 ±0.01%。

## 项目链接

[MSPM0-Projects](https://github.com/littleclock2/MSPM0-Projects)
