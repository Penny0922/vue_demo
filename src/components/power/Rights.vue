<template>
  <div class="app-container">
    <iframe
      id="reportFrame"
      width="100%"
      height="80%"
      frameborder="0"
      src="http://localhost:8075/webroot/decision/view/report?viewlet=ordersale.cpt"
    >
    </iframe>
  </div>
</template>
<script>
export default {
  mounted() {
    window.onload = function () {
      var contentPane = document
        .getElementById("reportFrame")
        .contentWindow._g();
      contentPane.on("afterload", function () {
        this.setframeHeight();
      });
    };
  },
  methods: {
    setframeHeight() {
      var reportFrame = document.getElementById("reportFrame");
      // 获得页面中的所有行
      var tr = reportFrame.contentWindow.document.getElementsByTagName("tr");
      //为了避免报表加载结束后出现滚动条现象，这里将报表容器的 overflow 属性设置为 hidden
      //由于在报表容器属性的设置只能在报表计算之后，所以用 setTimeout 来设置延迟执行时间，如果数据过多，请按照具体情况修改延迟时间
      setTimeout(function () {
        document
          .getElementById("reportFrame")
          .contentWindow.document.getElementById(
            "content-container"
          ).style.overflow = "hidden";
      }, 10);
      // 由于报表页面还存在页边距，因此框架高度是大于所有行累计的高度的，这里赋一个初始值以表示边距的大小
      var height = 30;
      for (var i = 0; i < tr.length; i++) {
        //由于报表页面加载完成之后，可能会将单元格也在加载成一个 tr，会导致重复计算，这里通过条件判断来获取行的 tr
        if (tr[i].id.substring(0, 1) == "r") {
          height = height + tr[i].offsetHeight;
        }
      }
      this.reportFrame.height = height;
      console.log("高度", this.reportFrame.height);
    },
  },
};
</script>
