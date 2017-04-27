/**
 * Created by Admin on 21.04.2017.
 */
import {FilesCollection} from 'meteor/ostrio:files';
import 'meteor/fish:ffmpeg';
import * as VARS from './localStorageVars';


export const Dump = new FilesCollection({
  collectionName: 'Dump',
  storagePath: VARS.STORAGE_PATH,
  downloadRoute: VARS.DOWNLOAD_ROUTE,
  allowClientCode: false,
  cacheControl: 'public, max-age=31536000',
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= VARS.FILE.SIZE && /webm|mp4|3gp/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 20MB';
    }
  },
  downloadCallback: function (fileObj) {
    // TODO: Add client watch counter + webm watch counter
    // if (this.params.query.download == 'true') {
    //   // Increment downloads counter
    //   Images.update(fileObj._id, {$inc: {'meta.downloads': 1}});
    // }
    // // Must return true to continue download
    return true;
  },
  onAfterUpload: function(fileRef) {
    return true;

    var formats, sourceFile;
    sourceFile = ffmpeg(fileRef.path).noProfile();
    _.each(formats, function(convert, format) {
      var file, upd, version;
      if (convert) {
        file = _.clone(sourceFile);
        version = file.someHowConvertVideoAndReturnFileData(format);
        upd = {
          $set: {}
        };
        upd['$set']['thumbnail.' + format] = {
          path: version.path,
          size: version.size,
          type: version.type,
          extension: version.extension
        };
        return Videos.update(fileRef._id, upd);
      }
    });
  }
});
