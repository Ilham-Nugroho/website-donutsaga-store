const rootStyles = window.getComputedStyle (document.documentElement);

if (rootStyles.getPropertyValue('--donut-cover-width-large') != null && rootStyles.getPropertyValue('--donut-cover-width-large') !== '') {
  ready()
} else {
  document.getElementById('main-css').addEventListener('load', ready)
}


function ready() {
  const coverWidth = parseFloat(rootStyles.getPropertyValue('--donut-cover-width-large'))
  const coverAspectRatio = parseFloat(rootStyles.getPropertyValue('--donut-cover-aspect-ratio'))
  const coverHeight = coverWidth / coverAspectRatio
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )

  FilePond.setOptions({
    stylePanelAspectRatio: 150/100,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150
  })

  FilePond.parse(document.body);

}
