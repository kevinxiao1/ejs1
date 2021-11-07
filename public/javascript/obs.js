
function con() {
    const obs = new OBSWebSocket();

    document.getElementById('address_button').addEventListener('click', e => {

    obs.connect({
        address: 'localhost:4444',
        password: 'kw912049'
    });
    });

    obs.on('ConnectionOpened', () => {
    obs.send('GetSceneList').then(data => {
        const sceneListDiv = document.getElementById('scene_list');

        data.scenes.forEach(scene => {
        const sceneElement = document.createElement('button');
        sceneElement.textContent = scene.name;
        sceneElement.onclick = function() {
            obs.send('SetCurrentScene', {
            'scene-name': scene.name
            });
        };

        sceneListDiv.appendChild(sceneElement);
        });
    })
    });
}
