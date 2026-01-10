const weatherConfig = {
            // 初始天气数据（25℃）
            initial: {
                condition: '晴',
                temp: 25.0,          // 初始温度：25℃
                feels: 26.0,         // 初始体感温度
                humidity: 45,        // 初始湿度
                wind: '东南风 3级'
            },
            // 目标固定天气数据（10℃）
            target: {
                condition: '晴',
                temp: 10.0,           // 目标温度：10℃
                feels: 8.5,           // 目标体感温度
                humidity: 80,         // 目标湿度
                wind: '西北风 1级'
            },
            duration: 2000,        // 渐变时长（20秒）
            startTime: Date.now(),  // 渐变开始时间
            completed: false        // 渐变完成标记
        };

        // 线性插值函数（实现数值平滑过渡）
        function lerp(start, end, progress) {
            return start + (end - start) * progress;
        }

        // 时间+日期实时更新函数
        function updateTime() {
            const now = new Date();
            // 时间格式化
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            // 日期格式化
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
            const weekday = weekdays[now.getDay()];

            // 更新时间和日期（始终实时）
            const timeEl = document.getElementById('current-time');
            const dateEl = document.getElementById('current-date');
            if (timeEl) timeEl.textContent = `${hours}:${minutes}:${seconds}`;
            if (dateEl) dateEl.textContent = `${year}年${month}月${day}日 星期${weekday}`;

            // 天气渐变逻辑
            if (!weatherConfig.completed) {
                // 计算渐变进度（0-1）
                const elapsed = Date.now() - weatherConfig.startTime;
                const progress = Math.min(elapsed / weatherConfig.duration, 1);
                
                // 当进度达到1时，标记为完成
                if (progress >= 1) {
                    weatherConfig.completed = true;
                }

                // 计算渐变后的数值（核心：温度从25→10平滑变化）
                const currentTemp = lerp(weatherConfig.initial.temp, weatherConfig.target.temp, progress).toFixed(1);
                const currentFeels = lerp(weatherConfig.initial.feels, weatherConfig.target.feels, progress).toFixed(1);
                const currentHumidity = Math.round(lerp(weatherConfig.initial.humidity, weatherConfig.target.humidity, progress));
                
                // 文字类信息：进度超过50%时切换为目标值
                const currentCondition = progress > 0.5 ? weatherConfig.target.condition : weatherConfig.initial.condition;
                const currentWind = progress > 0.5 ? weatherConfig.target.wind : weatherConfig.initial.wind;

                // 更新天气DOM
                const conditionEl = document.getElementById('realtime-condition');
                const tempEl = document.getElementById('realtime-temp');
                const feelsEl = document.getElementById('realtime-feels');
                const humidityEl = document.getElementById('realtime-humidity');
                const windEl = document.getElementById('realtime-wind');

                if (conditionEl) conditionEl.textContent = currentCondition;
                if (tempEl) tempEl.textContent = `${currentTemp}℃`;
                if (feelsEl) feelsEl.textContent = `${currentFeels}℃`;
                if (humidityEl) humidityEl.textContent = `${currentHumidity}%`;
                if (windEl) windEl.textContent = currentWind;
            } else {
                // 渐变完成后，固定显示目标值（10℃）
                const conditionEl = document.getElementById('realtime-condition');
                const tempEl = document.getElementById('realtime-temp');
                const feelsEl = document.getElementById('realtime-feels');
                const humidityEl = document.getElementById('realtime-humidity');
                const windEl = document.getElementById('realtime-wind');

                if (conditionEl) conditionEl.textContent = weatherConfig.target.condition;
                if (tempEl) tempEl.textContent = `${weatherConfig.target.temp.toFixed(1)}℃`;
                if (feelsEl) feelsEl.textContent = `${weatherConfig.target.feels.toFixed(1)}℃`;
                if (humidityEl) humidityEl.textContent = `${weatherConfig.target.humidity}%`;
                if (windEl) windEl.textContent = weatherConfig.target.wind;
            }
        }

        // 搜索引擎选择器交互
        function initEngineSelector() {
            const engineSelected = document.getElementById('engine-selected');
            const engineOptions = document.querySelectorAll('.engine-option');
            const selectedEngineName = document.getElementById('selected-engine-name');
            const selectedEngineIcon = document.getElementById('selected-engine-icon');

            engineOptions.forEach(option => {
                option.addEventListener('click', function() {
                    // 移除所有active状态
                    engineOptions.forEach(opt => opt.classList.remove('active'));
                    // 添加当前active状态
                    this.classList.add('active');
                    // 更新选中的引擎名称和图标
                    const engineName = this.querySelector('.engine-name').textContent;
                    const engineIcon = this.getAttribute('data-icon');
                    if (selectedEngineName) selectedEngineName.textContent = engineName;
                    if (selectedEngineIcon) {
                        selectedEngineIcon.className = `engine-icon ${engineIcon}-icon`;
                    }
                    // 更新勾选状态
                    engineOptions.forEach(opt => {
                        opt.querySelector('.engine-check').textContent = opt === this ? '✓' : '';
                    });
                });
            });

            // 点击外部关闭下拉菜单
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.engine-selector')) {
                    const optionsContainer = document.getElementById('engine-options');
                    if (optionsContainer) optionsContainer.style.display = 'none';
                }
            });

            // 切换下拉菜单显示/隐藏
            if (engineSelected) {
                engineSelected.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const optionsContainer = document.getElementById('engine-options');
                    if (optionsContainer) {
                        optionsContainer.style.display = optionsContainer.style.display === 'block' ? 'none' : 'block';
                    }
                });
            }
        }

        // 初始化页面
        document.addEventListener('DOMContentLoaded', function() {
            // 立即更新时间和天气
            updateTime();
            // 每秒更新时间和天气渐变
            setInterval(updateTime, 10);
            // 初始化搜索引擎选择器
            initEngineSelector();
        });