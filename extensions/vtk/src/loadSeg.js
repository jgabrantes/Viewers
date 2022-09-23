

import { MODULE_TYPES, utils } from '@ohif/core';

import loadSegmentation from '../../dicom-segmentation/src/loadSegmentation'

export default async function loadSeg(imageIds, displaySet) {

  console.log(displaySet.wadoRoot)
  const segDisplaySet = {
    Modality: 'SEG',
    displaySetInstanceUID: utils.guid(),
    wadoRoot: study.getData().wadoRoot,
    wadoUri: instance.getData().wadouri,
    SOPInstanceUID,
    SeriesInstanceUID,
    StudyInstanceUID,
    FrameOfReferenceUID,
    authorizationHeaders,
    isDerived: true,
    referencedDisplaySetUID: null, // Assigned when loaded.
    labelmapIndex: null, // Assigned when loaded.
    isLoaded: false,
    loadError: false,
    hasOverlapping: false,
    SeriesDate,
    SeriesTime,
    SeriesNumber,
    SeriesDescription,
    metadata,
    tolerance: 1e-2,
  };


  loadSegmentation(imageIds, segDisplaySet, labelMapBuffer, segMetadata, segmentsOnFrame, labelMapSegments);

}
