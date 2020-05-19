export class Api {
    static baseUrl = '';
    static prefix = 'api';
    static teamsStr = 'teams';
    static eventStr = 'events'

    static Teams = {
        Get: `${this.baseUrl}/${this.prefix}/${this.teamsStr}/get`,
        GetAll: `${this.baseUrl}/${this.prefix}/${this.teamsStr}/getAll`,
        GetPage: `${this.baseUrl}/${this.prefix}/${this.teamsStr}/getPage`,
        Create: `${this.baseUrl}/${this.prefix}/${this.teamsStr}/create`,
        Delete: `${this.baseUrl}/${this.prefix}/${this.teamsStr}/delete`,
        Edit: `${this.baseUrl}/${this.prefix}/${this.teamsStr}/edit`
    }
    static Events = {
        GetEventsAll: `${this.baseUrl}/${this.prefix}/${this.eventStr}/getall`,
    }
}