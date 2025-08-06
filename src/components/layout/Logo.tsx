import { Flex } from 'antd';
import LogoDarkSvg from '@/assets/logo-dark-streamline.svg';
import LogoLightSvg from '@/assets/logo-light-streamline.svg';

type LogoProps = {
  theme: string;
}
export const Logo = ({ theme }: LogoProps) => {
  return (
    <Flex gap="small" align="center" justify="center" style={{ padding: '1.5rem 0' }}>
      {theme === 'light' ? <LogoLightSvg className="w-10 h-10" /> : <LogoDarkSvg className="w-10 h-10" />}
    </Flex>
  );  
};
