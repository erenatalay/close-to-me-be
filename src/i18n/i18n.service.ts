import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class I18nService {
  getI18n() {
    return I18nContext.current();
  }

  translate(key: string, options?: any): string {
    const i18n = this.getI18n();
    return i18n.t(key, options);
  }
}
