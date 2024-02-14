$(document).ready(function () {
    $(window).on("resize", function () {
        //if (window.innerHeight > window.innerHeight) {// 
        //    $("#charDiv").attr("height", window.innerHeight);
        //} else {
        //    $("#charDiv").attr("height", window.innerHeight - 200);
        //}
    });
    $(window).resize();

    var chartOptions = {
        chart: {
            renderTo: 'chartDiv',
            //backgroundColor: "#f9f9f9", // the default jQuery bg color
            zoomType: '',
            panning: true,
            panKey: 'shift'
        },
        title: {
            text: 'Trajectory'
        },
        xAxis: {
            title: {
                text: "Range (m)"
            }
        },
        yAxis: {
            title: {
                text: "Height (m)"
            },
            floor: 0
        },
        plotOptions: {
            series: {
                animation: {
                    duration: 2000
                }
            }
        },
        tooltip: {
            formatter: function () {
                var x;
                var y;
                if (this.x < 100) { // preserve decimal part when the number is small
                    x = this.x.toPrecision(3);
                } else { // use thousand separator when the number is large
                    x = Highcharts.numberFormat(this.x.toPrecision(3), 0, '.', ',');
                }
                if (this.y < 100) {
                    y = this.y.toPrecision(3);
                } else {
                    y = Highcharts.numberFormat(this.y.toPrecision(3), 0, '.', ',');
                }
                return "(<strong>" + x + "</strong>, <strong>" + y + '</strong>)';
            }
        },
        series: [{}]
    };

    var chart = new Highcharts.Chart(chartOptions);
    chart.series[0].remove(true);
    var deltaTime = 0.0001;
    var angle = 45;
    var dataArray = [];

    function Ball() {
        this.initV = $("#velocity").val(); // do not change when the ball is moving
        if (this.initV == 0) {
            return;
        } // prevent bug after firing with v==0
        this.launchAngle = angle; // do not change when the ball is moving
        this.x = 0;
        this.y = 0;
        this.vX = this.initV * Math.cos(this.launchAngle * (Math.PI) / 180);
        this.vY = this.initV * Math.sin(this.launchAngle * (Math.PI) / 180);
        this.aX = 0; // wind
        this.aY = -9.8; // gravity
        this.maxY = 0;
        this.velocity = function () {
            return Math.sqrt(this.vX * this.vX + this.vY * this.vY);
        };
    }

    function ballMove() {
        var v_sq = (ball.vX * ball.vX + ball.vY * ball.vY);
        var v = Math.sqrt(v_sq);
        var resist = v_sq * airResistCoefficient * airResistanceOn; // quadratic
        ball.vX += (ball.aX - ball.vX / v * resist) * deltaTime;
        ball.vY += (ball.aY - ball.vY / v * resist) * deltaTime;
        ball.x += ball.vX * deltaTime;
        ball.y += ball.vY * deltaTime;
        if (ball.y > ball.maxY) {
            ball.maxY = ball.y;
        }
    }

    function simulate() {
        var tick = 0;
        while (ball.y >= 0) {
            ballMove();
            if (tick % 100 == 0) {
                var x = (Number)(ball.x);
                var y = (Number)(ball.y);
                dataArray.push([x, y]);
                updateReadouts(tick * deltaTime, x, ball.maxY, ball.velocity());
            }
            tick++;
        }

        chart.addSeries({
            //name: (chart.series.length) == 0 ? "Test" : ("#" + (chart.series.length)),
            name: "#" + (chart.series.length + 1),
            data: dataArray
        });
        dataArray = [];

        setTimeout(
            function () {
                fireButton.removeClass('ui-disabled');
                clearButton.removeClass('ui-disabled');
                fireButton.html('Fire!');
            }, 1000
        );
    }

    // buttons and sliders
    var fireButton = $("#fireBtn");
    var clearButton = $("#clearBtn");
    fireButton.click(function () {
        ball = new Ball();
        $(this).addClass('ui-disabled');
        $(this).html('Boom!');
        simulate();
    });
    clearButton.click(function () {
        fireButton.removeClass('ui-disabled');
        fireButton.html('Fire!');
        while (chart.series.length > 0) {
            chart.series[0].remove(true);
        }
    });

    var vSlider = $("#velocity");
    $("#vRange").on('change', function () {
        var maxV = Math.pow(10, this.value);
        var step = 1;
        if (this.value == 1) {
            step = 0.1;
        }
        vSlider.attr("max", maxV).attr("step", step).slider("refresh");
        deltaTime = maxV / 100 * 0.0001;
    });

    $("#angle").on("change", function () {
        angle = $(this).val();
    });

    var airResistanceOn = false;
    var airResistCoefficient = 0;
    var resistanceDiv = $("#resistanceDiv");
    //resistanceDiv.hide();
    $("#resistanceOn").on('change', function () {
        airResistanceOn = this.checked;
        if (this.checked) {
            //resistanceDiv.fadeIn();
            resistanceDiv.removeClass("ui-disabled");
        } else {
            //resistanceDiv.fadeOut();
            resistanceDiv.addClass("ui-disabled");
        }
    });

    var dragSliderScale = 0.001;
    $("#resistance").on("change", function () {
        airResistCoefficient = this.value * dragSliderScale;
        $("#dragValue").text("(b/m) = " + airResistCoefficient.toPrecision(3));
    });

    $("#rRange").on("change", function () {
        if (this.value == 1) {
            $("#resistance").attr("max", 20).attr("step", "0.1").slider("refresh");
            dragSliderScale = 0.001;
            $("#s").text("1000");
        } else if (this.value == 2) {
            $("#resistance").attr("max", 1).attr("step", "0.001").slider("refresh");
            dragSliderScale = 0.0001;
            $("#s").text("10000");
        }
    });

    $("#tips").on("click", function () {
        $("#tip").toggle("fast");
    });

    $("#zoomType").on("change", function () {
        setZoomType(this.value);
    });

    function setZoomType(type) {
        if (type == '') {
            chart.options.zoomType = '';
            chart.pointer.zoomX = false;
            chart.pointer.zoomY = false;
            chart.pointer.zoomHor = false;
            chart.pointer.zoomVert = false;
        } else if (type == 'x') {
            chart.options.zoomType = 'x';
            chart.pointer.zoomX = true;
            chart.pointer.zoomY = false;
            chart.pointer.zoomHor = true;
            chart.pointer.zoomVert = false;
        } else if (type == 'y') {
            chart.options.zoomType = 'y';
            chart.pointer.zoomX = false;
            chart.pointer.zoomY = true;
            chart.pointer.zoomHor = false;
            chart.pointer.zoomVert = true;
        } else if (type == 'xy') {
            chart.options.zoomType = 'xy';
            chart.pointer.zoomX = true;
            chart.pointer.zoomY = true;
            chart.pointer.zoomHor = true;
            chart.pointer.zoomVert = true;
        }
    }

    var readout = $("#readout");
    var timeReadout = readout.find("#time");
    var rangeReadout = readout.find("#range");
    var heightReadout = readout.find("#h");
    var velocityReadout = readout.find("#v");

    function updateReadouts(time, range, height, velocity) {
        timeReadout.text(time.toPrecision(3));
        rangeReadout.text(range.toPrecision(3));
        heightReadout.text(height.toPrecision(3));
        velocityReadout.text(velocity.toPrecision(3));
    }

    $("#toggleReadout").on("click", function () {
        readout.toggle("fast");
    });

});