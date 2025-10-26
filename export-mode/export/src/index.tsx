import i18n from 'i18next';
import { id } from './id';
import { initToolGroups, toolbarButtons, cornerstone,
  ohif,
  basicLayout,
  basicRoute,
  extensionDependencies as basicDependencies,
  mode as basicMode,
  modeInstance as basicModeInstance,
 } from '@ohif/mode-basic';


export const tracked = {
  measurements: '@ohif/extension-measurement-tracking.panelModule.trackedMeasurements',
  thumbnailList: '@ohif/extension-measurement-tracking.panelModule.seriesList',
  viewport: '@ohif/extension-measurement-tracking.viewportModule.cornerstone-tracked',
};

export const extensionDependencies = {
  // Can derive the versions at least process.env.from npm_package_version
  ...basicDependencies,
  '@ohif/extension-measurement-tracking': '^3.0.0',
  'export-extension': '^0.0.1'
};

export const exportInstance = {
  ...basicLayout,
  id: ohif.layout,
  props: {
    ...basicLayout.props,
    leftPanels: [tracked.thumbnailList],
    rightPanels: [cornerstone.segmentation, tracked.measurements],
    viewports: [
      {
        namespace: tracked.viewport,
        // Re-use the display sets from basic
        displaySetsToDisplay: basicLayout.props.viewports[0].displaySetsToDisplay,
      },
      ...basicLayout.props.viewports,
      ],
    }
  };


export const exportRoute =
    {
      ...basicRoute,
      path: 'export',
        /*init: ({ servicesManager, extensionManager }) => {
          //defaultViewerRouteInit
        },*/
      layoutInstance: exportInstance,
    };

// export function onModeEnter({
//   servicesManager,
// }: withAppTypes) {
//   const { toolbarService } = servicesManager.services;

//       toolbarService.register('export-extension.toolbarModule');
//       toolbarService.updateSection('primary', 
//         ['export-extension.toolbarModule.ExportViewport']);

// }

// export function onModeExit({
//   servicesManager,
// }: withAppTypes) {
//   const { toolbarService } = servicesManager.services;
//   toolbarService.reset();
// }

export const modeInstance = {
    ...basicModeInstance,
    // TODO: We're using this as a route segment
    // We should not be.
    id,
    routeName: 'export',
    displayName: 'Export Mode',
    routes: [
      exportRoute
    ],
    extensions: extensionDependencies,
    toolbarSections: {
      'primary': ['ExportViewport']
    }

  };

const mode = {
  ...basicMode,
  id,
  modeInstance,
  extensionDependencies,
};

export default mode;
export { initToolGroups, toolbarButtons };
