import MailTemplateProvider from '../models/MailTemplateProvider'

class FakeMailTemplateProvider implements MailTemplateProvider {
  public async parse(): Promise<string> {
    return 'Mail Content'
  }
}

export default FakeMailTemplateProvider
