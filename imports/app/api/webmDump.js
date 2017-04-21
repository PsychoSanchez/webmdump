/**
 * Created by Admin on 21.04.2017.
 */
import {FilesCollection} from 'meteor/ostrio:files';

const FILE =
  {
    SIZE: 20971520
  };

export const Dump = new FilesCollection({
  collectionName: 'Dump',
  storagePath: 'assets/app/uploads/Dump',
  downloadRoute: '/files/dump',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= FILE.SIZE && /webm|mp4|3gp/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 10MB';
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
});