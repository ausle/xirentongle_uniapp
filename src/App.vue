<script>
export default {
  onLaunch() {
    console.log('App Launch')
  },
}
</script>

<style>
page {
  background: #fffdf7;
  color: #3d2c2c;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Noto Serif SC',
    'Microsoft YaHei', sans-serif;
}

view,
text,
button,
input,
scroll-view,
swiper,
swiper-item {
  box-sizing: border-box;
}

image {
  display: block;
}

button {
  margin: 0;
  padding: 0;
  line-height: 1;
  background: transparent;
  border: 0;
}

button::after {
  border: 0;
}

.serif {
  font-family: 'Noto Serif SC', Georgia, 'Times New Roman', serif;
}

.line-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.line-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.fill-img {
  width: 100%;
  height: 100%;
}
</style>
