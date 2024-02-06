#!/usr/bin/env python3
"""A simple flask application
"""


from flask import Flask, render_template, request, g
from flask_babel import Babel
from pytz import timezone
import pytz.exceptions


class Config(object):
    """
    babel config
    """
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'


app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False
babel = Babel(app)


users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


def get_user():
    """returns a user dict or None if the ID is not found
    """
    login_id = request.args.get('login_as')
    if login_id:
        return users.get(int(login_id))
    return None


@app.before_request
def before_request() -> None:
    """before request
    """
    user = get_user()
    g.user = user


@babel.localeselector
def get_locale():
    """
    locale
    """

    locale = request.args.get('locale')
    if locale in app.config['LANGUAGES']:
        return locale

    if g.user:
        locale = g.user.get('locale')
        if locale and locale in app.config['LANGUAGES']:
            return locale

    locale = request.headers.get('locale', None)
    if locale in app.config['LANGUAGES']:
        return locale

    return request.accept_languages.best_match(app.config['LANGUAGES'])


# time zone function
@babel.timezoneselector
def get_timezone():
    """
    Select and return appropriate timezone
    """

    time_zone = request.args.get('timezone', None)
    if time_zone:
        try:
            return timezone(time_zone).zone
        except pytz.exceptions.UnknownTimeZoneError:
            pass

    if g.user:
        try:
            tzone = g.user.get('timezone')
            return timezone(tzone).zone
        except pytz.exceptions.UnknownTimeZoneError:
            pass

    default_time_zone = app.config['BABEL_DEFAULT_TIMEZONE']
    return default_time_zone


@app.route('/')
def index():
    """ main route
    """
    return render_template('5-index.html')


if __name__ == '__main__':
    app.run(port="5000", host="0.0.0.0", debug=True)
