import {useState, useEffect} from 'react';
import {supabase} from '../services/supabase';
import {useAuthStore} from '../store/auth-store';

interface ReferralInfo {
  code: string;
  totalReferrals: number;
  loading: boolean;
}

export function useReferral(): ReferralInfo & {shareText: string} {
  const [code, setCode] = useState<string>('');
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    if (!user) {
      return;
    }
    const load = async () => {
      setLoading(true);
      // Get user's referral code
      const {data: rc} = await supabase
        .from('referral_codes')
        .select('code')
        .eq('user_id', user.id)
        .single();

      if (rc) {
        setCode(rc.code);
      } else {
        // Generate a new code if none exists
        const newCode = `ISDB-${user.id.slice(0, 6).toUpperCase()}`;
        await supabase
          .from('referral_codes')
          .insert({user_id: user.id, code: newCode});
        setCode(newCode);
      }

      // Count referrals from this user
      const {data: refs} = await supabase
        .from('referrals')
        .select('id', {count: 'exact'})
        .eq('referrer_id', user.id);

      setTotalReferrals(refs?.length || 0);
      setLoading(false);
    };
    load();
  }, [user]);

  const shareText = `Join Insane Dream Builder! Use my code: ${
    code || 'ISDB-XXXXXX'
  }`;

  return {code, totalReferrals, loading, shareText};
}
