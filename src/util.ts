export function _arrayBufferToBase64(buffer: ArrayBuffer) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

export type FilesCallback = (files: FileList | null) => void;

export function openBrowseDialog(multiple: boolean, callback: FilesCallback) {
    let input = document.createElement('input');
    input.type = 'file';
    input.multiple = multiple;
    input.onchange = (ev) => {
        callback((ev.target as HTMLInputElement).files);
    }
    input.click();
}