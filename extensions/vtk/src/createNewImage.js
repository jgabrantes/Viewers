import cornerstone from 'cornerstone-core';

export default async function createNewImage(element, pixelArray, image) {



  const tamanho = image.getPixelData().length


  console.log(pixelArray);
  function getPixelData() {
    const width = image.width;
    const height = image.height;
    const numPixels = width * height;
    const pixelData = pixelArray;
    let index = 0;
    return pixelData;
  }


  const dynamicImage = {
    imageId: image.imageId,
    minPixelValue: image.minPixelValue,
    maxPixelValue: image.maxPixelValue,
    slope: image.slope,
    intercept: image.intercept,
    windowCenter: image.windowCenter,
    windowWidth: image.windowWidth,
    render: image.render,
    getPixelData: getPixelData,
    rows: image.rows,
    columns: image.columns,
    height: image.height,
    width: image.width,
    color: image.color,
    columnPixelSpacing: image.columnPixelSpacing,
    rowPixelSpacing: image.rowPixelSpacing,
    invert: image.invert,
    sizeInBytes: image.sizeInBytes,
    falseColor: image.falseColor,
    colormap: image.colormap,
    data: {
      opacity: image.opacity
    }
  };


  /*
      Subscribe to new displaySets as the source may come in after.
      DisplaySetService.subscribe(DisplaySetService.EVENTS.DISPLAY_SETS_CHANGED,
        data => {
          const { displaySetsAdded } = data;
          // If there are still some measurements that have not yet been loaded into cornerstone,
          // See if we can load them onto any of the new displaySets.
          displaySetsAdded.forEach(newDisplaySet => {
            console.log(getDisplaySetForSOPInstanceUID(SOPInstanceUID, SeriesInstanceUID));

          });
        }
      );
    console.log(displaySet);


    //cornerstone.displayImage(element, dynamicImage);
    console.log(dynamicImage);
     */
  return dynamicImage;
}
