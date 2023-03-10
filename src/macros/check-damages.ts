(async () => {
  const character = game.user?.character;
  if (character === undefined) {
    return ui.notifications.error("You don't have a Character.");
  }
  const _weapons = character.inventory.contents.filter((item) => item.type === 'weapon');
  const weapons = _weapons.filter(
    (weapon) =>
      weapon.traits.has('modular') ||
      weapon.traits.has('versatile-p') ||
      weapon.traits.has('versatile-s') ||
      weapon.traits.has('versatile-b')
  );
  if (weapons.length < 1) {
    return ui.notifications.warn("You don't have a Modular/Versatile Weapon.");
  }
  const weaponsContent = weapons.map((weapon) => `<div>${weapon.name}: ${weapon.system.damage.damageType}<div>`).join('');
  const content = [
    '<div style="display:flex;flex-direction:column;">',
    '<h3>Current damage types</h3>',
    `${weaponsContent}`,
    '<span>&nbsp;</span>',
    '</div>',
  ].join('');
  Dialog.prompt({
    title: 'Current damage types',
    content,
  });
})();
