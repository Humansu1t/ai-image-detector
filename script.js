// Set the number of tags to display per page
const tagsPerPage = 20;
//Event listener for the upload button
document.getElementById('uploadButton').addEventListener('click', async () => {
    //Elements and file handling
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];
    const imagePreview = document.getElementById('imagePreview');
    const uploadModal = document.getElementById('uploadModal');
    const uoloadProgress = document.getElementById('uploadProgress');

    //if no file is selected, show toast image
    if (!file) return showToast('Please select an image file first.');

    //Preview the selected image
    const reader = new FileReader();
    reader.onload = e => imagePreview.src = e.target.result;
    reader.readAsDataURL(file);


    //Imagga API condeetials
    const apiKey = 'acc_f376cbfdb72a436';
    const apiSecret = '70865df96ca88faee436c6ab6990795d';
    const authHeader = 'Basic' + btoa(`${apiKey}:${apiSecret}`);

    //Prepare data for upload
    const formData = new formData();
    formData.append('image', file);

    try{
        //Show upload modal and reset progress bar
        uploadModal.style.display = 'block';
        uploadProgress.style.width ='0%';

        //Upload image to Imagga
        const uploadResponse = await fetch('https://api.imagga.com/v2/uploads', {
            method: 'POST',
            headers: {'Authorization': authHeader},
            body : formData
        }); 

        if(!uploadResponse.ok) throw new Error('Upload failed');

        // Track upload progress
        const contentLength = +uploadResponse.headers.get('Content-Length');
        const reader = uploadResponse.body.getReader();
        let receivedLength = 0;
        let chunks = [];

        // Read reasponse stream and update progress
        while(true) {
            const { done, value} = await reader.read();
            if (done) break;
            chunks.push(value);
            receivedLength += value.length;
            uploadProgress.style.width = `${(receivedLength/contentLength) * 100}%`;

    }
    //Decode and parse upload response
    const responseArray = new Uint8Array(receivedLength);
    let position = 0;
    for (const chunk of chunks){
        responseArray.set(chunk, position);
        position += chunk.length;
    }

    const test = new TextDecoder('utf-8').decode(responseArray);
    const {result: {upload_id}} = JSON.parse(text);

}
})