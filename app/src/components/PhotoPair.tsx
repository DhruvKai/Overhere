import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Icon, type IconName } from '@/components/ui';
import { friendly } from '@/lib/api';
import { avatarUrl, pickPhoto, savePhoto } from '@/lib/avatar';
import { useModel, useStore } from '@/lib/store';
import { useTheme } from '@/lib/theme';

const TIPS: [IconName, string][] = [
  ['user', 'Your face must be clearly visible: just you, facing the camera, nothing covering it'],
  ['sun', 'Good light. No filters, sunglasses, masks or mirror selfies'],
  ['layers', 'Two different, recent photos, like one close-up and one from another day'],
];

/* The two photos the face check is matched against, the same as photoPair in web/app.js: two square slots side by
   side, then what makes a photo pass. Tapping a slot picks a photo for it; photo 2 only once there is a photo 1. */
export function PhotoPair({ onSaved }: { onSaved?: () => void }) {
  const t = useTheme();
  const m = useModel();
  const { run, toast } = useStore();
  const [busy, setBusy] = useState<0 | 1 | 2>(0);
  const p = m.profile!;
  const urls = [avatarUrl(p.photo), avatarUrl(p.photo2)];

  async function pick(slot: 1 | 2) {
    setBusy(slot);
    try {
      const b64 = await pickPhoto();
      if (b64) {
        const reset = await run(() => savePhoto(m.me, b64, slot));
        if (reset !== undefined) {
          toast(reset === true ? 'Photo changed. Please do the face check again, so it matches your new photo.'
            : slot === 1 && !p.photo2 ? 'Photo 1 saved. Now add photo 2.' : `Photo ${slot} saved`);
          onSaved?.();
        }
      }
    } catch (e) { toast(friendly(e)); }
    setBusy(0);
  }

  return (
    <View style={{ gap: 12, marginBottom: 14 }}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {([1, 2] as const).map(slot => {
          const url = urls[slot - 1], off = slot === 2 && !p.photo;
          return (
            <Pressable key={slot} accessibilityRole="button" accessibilityLabel={`${url ? 'Change' : 'Add'} photo ${slot}`} accessibilityState={{ disabled: off || !!busy }}
              disabled={off || !!busy} onPress={() => pick(slot)}
              style={{ flex: 1, aspectRatio: 1, borderRadius: 18, overflow: 'hidden', borderWidth: url ? 0 : 2, borderStyle: 'dashed', borderColor: t.line,
                backgroundColor: t.field, alignItems: 'center', justifyContent: 'center', gap: 8, opacity: off ? 0.5 : 1 }}>
              {url ? <Image source={{ uri: url }} style={{ position: 'absolute', width: '100%', height: '100%' }} contentFit="cover" transition={150} /> : null}
              {busy === slot ? <ActivityIndicator color={url ? '#fff' : t.acc} />
                : url ? <Text style={{ position: 'absolute', left: 8, bottom: 8, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99, overflow: 'hidden', backgroundColor: 'rgba(20,16,12,0.6)', color: '#fff', fontSize: 12, fontWeight: '600' }}>Change</Text>
                : (<><Icon name="camera" size={26} color={t.mute} /><Text style={{ color: t.mute, fontWeight: '600', fontSize: 14 }}>Add photo {slot}</Text></>)}
            </Pressable>
          );
        })}
      </View>
      {TIPS.map(([ic, tip]) => (
        <View key={tip} style={{ flexDirection: 'row', gap: 9 }}>
          <View style={{ marginTop: 2 }}><Icon name={ic} size={15} color={t.acc} /></View>
          <Text style={{ flex: 1, color: t.mute, fontSize: 13.5, lineHeight: 19 }}>{tip}</Text>
        </View>
      ))}
    </View>
  );
}
