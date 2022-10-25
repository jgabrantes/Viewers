import React from 'react';
import cornerstone from 'cornerstone-core';
import cornerstoneTools from 'cornerstone-tools';
import PropTypes from 'prop-types';

import { ViewportDownloadForm } from '@ohif/ui';
import { utils } from '@ohif/core';

import { getEnabledElement } from '../../cornerstone/src/state'
import PostProcesingPanel from '../../../platform/ui/src/components/content/postProcessingPanel/PostProcessingPanel';
import queryResults from './queryResults';
import createNewImage from './createNewImage';

const MINIMUM_SIZE = 100;
const DEFAULT_SIZE = 512;
const MAX_TEXTURE_SIZE = 10000;

const PostProcessingDownloadPanel = ({ onClose, activeViewportIndex, dataPixels, results }) => {
  const activeEnabledElement = getEnabledElement(activeViewportIndex);


  const enableViewport = viewportElement => {
    if (viewportElement) {
      cornerstone.enable(viewportElement);
    }
  };

  const disableViewport = viewportElement => {
    if (viewportElement) {
      cornerstone.disable(viewportElement);
    }
  };

  const updateViewportPreview = (viewportElement, downloadCanvas, fileType) =>
    new Promise(resolve => {
      cornerstone.fitToWindow(viewportElement);

      viewportElement.addEventListener(
        'cornerstoneimagerendered',
        function updateViewport(event) {
          const enabledElement = cornerstone.getEnabledElement(event.target)
            .element;
          const type = 'image/' + fileType;
          const dataUrl = downloadCanvas.toDataURL(type, 1);

          let newWidth = enabledElement.offsetHeight;
          let newHeight = enabledElement.offsetWidth;

          if (newWidth > DEFAULT_SIZE || newHeight > DEFAULT_SIZE) {
            const multiplier = DEFAULT_SIZE / Math.max(newWidth, newHeight);
            newHeight *= multiplier;
            newWidth *= multiplier;
          }

          resolve({ dataUrl, width: newWidth, height: newHeight });

          viewportElement.removeEventListener(
            'cornerstoneimagerendered',
            updateViewport
          );
        }
      );
    });

  const loadImage = (activeViewport, viewportElement, width, height) =>
    new Promise(resolve => {
      ;
      if (activeViewport && viewportElement) {
        const enabledElement = cornerstone.getEnabledElement(activeViewport);
        const viewport = Object.assign({}, enabledElement.viewport);
        delete viewport.scale;
        viewport.translation = {
          x: 0,
          y: 0,
        };
        console.log(results);
        cornerstone.loadImage(enabledElement.image.imageId).then(image => {
          //const newImage = createNewImage(enabledElement, dataPixels, image);
          createNewImage(enabledElement, dataPixels, image).then(newImage => {
            console.log(newImage, '------------', image);

            cornerstone.displayImage(viewportElement, newImage);
            cornerstone.setViewport(viewportElement, viewport);
            cornerstone.resize(viewportElement, true);

            const newWidth = Math.min(width || newImage.width, MAX_TEXTURE_SIZE);
            const newHeight = Math.min(height || newImage.height, MAX_TEXTURE_SIZE);

            resolve({ newImage, width: newWidth, height: newHeight });
          });

        });
      }
    });

  const toggleAnnotations = (toggle, viewportElement) => {
    cornerstoneTools.store.state.tools.forEach(({ name }) => {
      if (toggle) {
        cornerstoneTools.setToolEnabledForElement(viewportElement, name);
      } else {
        cornerstoneTools.setToolDisabledForElement(viewportElement, name);
      }
    });
  };

  const downloadBlob = (
    filename,
    fileType,
    viewportElement,
    downloadCanvas,
    activeViewport
  ) => {

    const enabledElement = cornerstone.getEnabledElement(activeViewport);
    var patientModule = cornerstone.metaData.get('patientModule', enabledElement.image.imageId);
    const modality = cornerstone.metaData.get('Modality', enabledElement.image.imageId);

    /*  const seriesMetadata =
        cornerstone.metaData.get('generalSeriesModule', imageId) || {};
      const imagePlaneModule =
        cornerstone.metaData.get('imagePlaneModule', imageId) || {};
      const { rows, columns, sliceThickness, sliceLocation } = imagePlaneModule;
      const { seriesNumber, seriesDescription } = seriesMetadata;
  */
    const generalStudyModule =
      cornerstone.metaData.get('generalStudyModule', enabledElement.image.imageId) || {};
    const { studyDate, studyTime, studyDescription } = generalStudyModule;


    var patientName = patientModule.patientName;
    var patientWeight = patientModule.patientWeight;
    console.log(patientModule);
    const petSequenceModule = cornerstone.metaData.get('', enabledElement.image.imageId);


    if (typeof patientName == 'undefined') patientName = 'Anonimo';
    queryResults(patientName, modality, patientWeight, studyDate + studyTime, studyDescription, results).then(function (Pi) {

      //loadSeg(stack.imageIds, studyMetadataManager);
    });
  };

  return (
    <PostProcesingPanel
      onClose={onClose}
      minimumSize={MINIMUM_SIZE}
      maximumSize={MAX_TEXTURE_SIZE}
      defaultSize={DEFAULT_SIZE}
      canvasClass={'cornerstone-canvas'}
      activeViewport={activeEnabledElement}
      enableViewport={enableViewport}
      disableViewport={disableViewport}
      updateViewportPreview={updateViewportPreview}
      loadImage={loadImage}
      toggleAnnotations={toggleAnnotations}
      downloadBlob={downloadBlob}
    />
  );
};

PostProcessingDownloadPanel.propTypes = {
  onClose: PropTypes.func,
  activeViewportIndex: PropTypes.number.isRequired,
};

export default PostProcessingDownloadPanel;
