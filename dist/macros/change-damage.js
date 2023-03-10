(async () => {
    const character = game.user?.character;
    if (character === undefined) {
        return ui.notifications.error("You don't have a Character.");
    }
    const _weapons = character.inventory.contents.filter((item) => item.type === 'weapon');
    const weapons = _weapons.filter((weapon) => weapon.traits.has('modular') ||
        weapon.traits.has('versatile-p') ||
        weapon.traits.has('versatile-s') ||
        weapon.traits.has('versatile-b'));
    if (weapons.length < 1) {
        return ui.notifications.warn("You don't have any Modular/Versatile Weapons.");
    }
    const showDialog = (title, content, selectId, arr) => new Promise((resolve) => {
        new Dialog({
            title,
            content,
            buttons: {
                ok: {
                    label: 'OK',
                    callback: (html) => {
                        const index = html.find(selectId)[0].value;
                        resolve(arr[index]);
                    },
                },
                cancel: {
                    label: 'Cancel',
                    callback: () => resolve(undefined),
                },
            },
        }).render(true);
    });
    const contentWeaponOptions = weapons.map((weapon, index) => `<option value=${index}>${weapon.name}</option>`);
    const contentWeaponSelection = [
        '<span style="display:flex;flex-direction:column;justify-content:center;">',
        '<h3>Select a Weapon to change its Damage Type.</h3>',
        `<select id="selected-weapon">${contentWeaponOptions}</select>`,
        '<span>&nbsp;</span>',
        '</span>',
    ].join('');
    const selectedWeapon = await showDialog('Select a Weapon', contentWeaponSelection, '#selected-weapon', weapons);
    if (selectedWeapon === undefined) {
        return;
    }
    const damages = [
        { value: 'piercing', display: 'Piercing' },
        { value: 'slashing', display: 'Slashing' },
        { value: 'bludgeoning', display: 'Bludgeoning' },
    ];
    const availableDamages = selectedWeapon.traits.has('modular')
        ? damages.slice()
        : damages.filter((damage) => damage.value === selectedWeapon._source.system.damage.damageType ||
            selectedWeapon.traits.has(`versatile-${damage.value.substring(0, 1)}`));
    const contentDamageOptions = availableDamages.map(({ display }, index) => `<option value=${index}>${display}</option>`);
    const contentDamageSelection = [
        '<span style="display:flex;flex-direction:column;justify-content:center;">',
        `<h3>Choose <strong>${selectedWeapon.name}</strong> new Damage Type.</h3>`,
        `<select id="damage-type">${contentDamageOptions}</select>`,
        '<span>&nbsp;</span>',
        '</span>',
    ].join('');
    const selectedDamageType = await showDialog('Choose Damage Type', contentDamageSelection, '#damage-type', availableDamages);
    if (selectedDamageType === undefined) {
        return;
    }
    selectedWeapon.system.damage.damageType = selectedDamageType.value;
    const content = `Changed <strong>${selectedWeapon.name}</strong>'s Damage Type to <strong>${selectedDamageType.display}</strong>`;
    ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({ token: actor }),
        content,
    });
})();
