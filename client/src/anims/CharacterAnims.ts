
// ***새롭게 16px 캐릭터로 변경하기 위한 코드*** //
import Phaser from 'phaser'

export const createCharacterAnims = (anims: Phaser.Animations.AnimationManager) => {
  const animsFrameRate = 15

  // noah ******** //
  anims.create({
    key: 'noah_idle_right',
    frames: anims.generateFrameNames('noah', {
      start: 56,
      end: 61,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'noah_idle_up',
    frames: anims.generateFrameNames('noah', {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'noah_idle_left',
    frames: anims.generateFrameNames('noah', {
      start: 68,
      end: 73,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'noah_idle_down',
    frames: anims.generateFrameNames('noah', {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'noah_run_right',
    frames: anims.generateFrameNames('noah', {
      start: 112,
      end: 117,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'noah_run_up',
    frames: anims.generateFrameNames('noah', {
      start: 118,
      end: 123,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'noah_run_left',
    frames: anims.generateFrameNames('noah', {
      start: 124,
      end: 129,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'noah_run_down',
    frames: anims.generateFrameNames('noah', {
      start: 130,
      end: 135,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'noah_sit_down',
    frames: anims.generateFrameNames('noah', {
      start: 3,
      end: 3,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'noah_sit_left',
    frames: anims.generateFrameNames('noah', {
      start: 234,
      end: 234,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'noah_sit_right',
    frames: anims.generateFrameNames('noah', {
      start: 233,
      end: 233,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'noah_sit_up',
    frames: anims.generateFrameNames('noah', {
      start: 1,
      end: 1,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  // maya *************
  anims.create({
    key: 'maya_idle_right',
    frames: anims.generateFrameNames('maya', {
      start: 56,
      end: 61,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'maya_idle_up',
    frames: anims.generateFrameNames('maya', {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'maya_idle_left',
    frames: anims.generateFrameNames('maya', {
      start: 68,
      end: 73,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'maya_idle_down',
    frames: anims.generateFrameNames('maya', {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'maya_run_right',
    frames: anims.generateFrameNames('maya', {
      start: 112,
      end: 117,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'maya_run_up',
    frames: anims.generateFrameNames('maya', {
      start: 118,
      end: 123,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'maya_run_left',
    frames: anims.generateFrameNames('maya', {
      start: 124,
      end: 129,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'maya_run_down',
    frames: anims.generateFrameNames('maya', {
      start: 130,
      end: 135,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'maya_sit_down',
    frames: anims.generateFrameNames('maya', {
      start: 3,
      end: 3,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'maya_sit_left',
    frames: anims.generateFrameNames('maya', {
      start: 234,
      end: 234,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'maya_sit_right',
    frames: anims.generateFrameNames('maya', {
      start: 233,
      end: 233,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'maya_sit_up',
    frames: anims.generateFrameNames('maya', {
      start: 1,
      end: 1,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  // nora ************
  anims.create({
    key: 'nora_idle_right',
    frames: anims.generateFrameNames('nora', {
      start: 56,
      end: 61,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'nora_idle_up',
    frames: anims.generateFrameNames('nora', {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'nora_idle_left',
    frames: anims.generateFrameNames('nora', {
      start: 68,
      end: 73,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'nora_idle_down',
    frames: anims.generateFrameNames('nora', {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'nora_run_right',
    frames: anims.generateFrameNames('nora', {
      start: 112,
      end: 117,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'nora_run_up',
    frames: anims.generateFrameNames('nora', {
      start: 118,
      end: 123,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'nora_run_left',
    frames: anims.generateFrameNames('nora', {
      start: 124,
      end: 129,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'nora_run_down',
    frames: anims.generateFrameNames('nora', {
      start: 130,
      end: 135,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'nora_sit_down',
    frames: anims.generateFrameNames('nora', {
      start: 3,
      end: 3,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'nora_sit_left',
    frames: anims.generateFrameNames('nora', {
      start: 234,
      end: 234,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'nora_sit_right',
    frames: anims.generateFrameNames('nora', {
      start: 233,
      end: 233,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'nora_sit_up',
    frames: anims.generateFrameNames('nora', {
      start: 1,
      end: 1,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  // owen ******************
  anims.create({
    key: 'owen_idle_right',
    frames: anims.generateFrameNames('owen', {
      start: 56,
      end: 61,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'owen_idle_up',
    frames: anims.generateFrameNames('owen', {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'owen_idle_left',
    frames: anims.generateFrameNames('owen', {
      start: 68,
      end: 73,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'owen_idle_down',
    frames: anims.generateFrameNames('owen', {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'owen_run_right',
    frames: anims.generateFrameNames('owen', {
      start: 112,
      end: 117,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'owen_run_up',
    frames: anims.generateFrameNames('owen', {
      start: 118,
      end: 123,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'owen_run_left',
    frames: anims.generateFrameNames('owen', {
      start: 124,
      end: 129,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'owen_run_down',
    frames: anims.generateFrameNames('owen', {
      start: 130,
      end: 135,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'owen_sit_down',
    frames: anims.generateFrameNames('owen', {
      start: 3,
      end: 3,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'owen_sit_left',
    frames: anims.generateFrameNames('owen', {
      start: 234,
      end: 234,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'owen_sit_right',
    frames: anims.generateFrameNames('owen', {
      start: 233,
      end: 233,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'owen_sit_up',
    frames: anims.generateFrameNames('owen', {
      start: 1,
      end: 1,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  // jiji *********
  anims.create({
    key: 'jiji_idle_right',
    frames: anims.generateFrameNames('jiji', {
      start: 56,
      end: 61,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'jiji_idle_up',
    frames: anims.generateFrameNames('jiji', {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'jiji_idle_left',
    frames: anims.generateFrameNames('jiji', {
      start: 68,
      end: 73,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'jiji_idle_down',
    frames: anims.generateFrameNames('jiji', {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'jiji_run_right',
    frames: anims.generateFrameNames('jiji', {
      start: 112,
      end: 117,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'jiji_run_up',
    frames: anims.generateFrameNames('jiji', {
      start: 118,
      end: 123,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'jiji_run_left',
    frames: anims.generateFrameNames('jiji', {
      start: 124,
      end: 129,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'jiji_run_down',
    frames: anims.generateFrameNames('jiji', {
      start: 130,
      end: 135,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'jiji_sit_down',
    frames: anims.generateFrameNames('jiji', {
      start: 3,
      end: 3,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'jiji_sit_left',
    frames: anims.generateFrameNames('jiji', {
      start: 234,
      end: 234,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'jiji_sit_right',
    frames: anims.generateFrameNames('jiji', {
      start: 233,
      end: 233,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'jiji_sit_up',
    frames: anims.generateFrameNames('jiji', {
      start: 1,
      end: 1,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  // john ******************* //
  anims.create({
    key: 'john_idle_right',
    frames: anims.generateFrameNames('john', {
      start: 56,
      end: 61,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'john_idle_up',
    frames: anims.generateFrameNames('john', {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'john_idle_left',
    frames: anims.generateFrameNames('john', {
      start: 68,
      end: 73,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'john_idle_down',
    frames: anims.generateFrameNames('john', {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'john_run_right',
    frames: anims.generateFrameNames('john', {
      start: 112,
      end: 117,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'john_run_up',
    frames: anims.generateFrameNames('john', {
      start: 118,
      end: 123,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'john_run_left',
    frames: anims.generateFrameNames('john', {
      start: 124,
      end: 129,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'john_run_down',
    frames: anims.generateFrameNames('john', {
      start: 130,
      end: 135,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'john_sit_down',
    frames: anims.generateFrameNames('john', {
      start: 3,
      end: 3,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'john_sit_left',
    frames: anims.generateFrameNames('john', {
      start: 234,
      end: 234,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'john_sit_right',
    frames: anims.generateFrameNames('john', {
      start: 233,
      end: 233,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'john_sit_up',
    frames: anims.generateFrameNames('john', {
      start: 1,
      end: 1,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  // mina *********************
  anims.create({
    key: 'mina_idle_right',
    frames: anims.generateFrameNames('mina', {
      start: 56,
      end: 61,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'mina_idle_up',
    frames: anims.generateFrameNames('mina', {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'mina_idle_left',
    frames: anims.generateFrameNames('mina', {
      start: 68,
      end: 73,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'mina_idle_down',
    frames: anims.generateFrameNames('mina', {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'mina_run_right',
    frames: anims.generateFrameNames('mina', {
      start: 112,
      end: 117,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'mina_run_up',
    frames: anims.generateFrameNames('mina', {
      start: 118,
      end: 123,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'mina_run_left',
    frames: anims.generateFrameNames('mina', {
      start: 124,
      end: 129,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'mina_run_down',
    frames: anims.generateFrameNames('mina', {
      start: 130,
      end: 135,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'mina_sit_down',
    frames: anims.generateFrameNames('mina', {
      start: 3,
      end: 3,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'mina_sit_left',
    frames: anims.generateFrameNames('mina', {
      start: 234,
      end: 234,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'mina_sit_right',
    frames: anims.generateFrameNames('mina', {
      start: 233,
      end: 233,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'mina_sit_up',
    frames: anims.generateFrameNames('mina', {
      start: 1,
      end: 1,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  // ryan ******************
  anims.create({
    key: 'ryan_idle_right',
    frames: anims.generateFrameNames('ryan', {
      start: 56,
      end: 61,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'ryan_idle_up',
    frames: anims.generateFrameNames('ryan', {
      start: 62,
      end: 67,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'ryan_idle_left',
    frames: anims.generateFrameNames('ryan', {
      start: 68,
      end: 73,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'ryan_idle_down',
    frames: anims.generateFrameNames('ryan', {
      start: 74,
      end: 79,
    }),
    repeat: -1,
    frameRate: animsFrameRate * 0.6,
  })

  anims.create({
    key: 'ryan_run_right',
    frames: anims.generateFrameNames('ryan', {
      start: 112,
      end: 117,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'ryan_run_up',
    frames: anims.generateFrameNames('ryan', {
      start: 118,
      end: 123,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'ryan_run_left',
    frames: anims.generateFrameNames('ryan', {
      start: 124,
      end: 129,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'ryan_run_down',
    frames: anims.generateFrameNames('ryan', {
      start: 130,
      end: 135,
    }),
    repeat: -1,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'ryan_sit_down',
    frames: anims.generateFrameNames('ryan', {
      start: 3,
      end: 3,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'ryan_sit_left',
    frames: anims.generateFrameNames('ryan', {
      start: 234,
      end: 234,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'ryan_sit_right',
    frames: anims.generateFrameNames('ryan', {
      start: 233,
      end: 233,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })

  anims.create({
    key: 'ryan_sit_up',
    frames: anims.generateFrameNames('ryan', {
      start: 1,
      end: 1,
    }),
    repeat: 0,
    frameRate: animsFrameRate,
  })
}
