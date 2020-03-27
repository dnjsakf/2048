import os
import dotenv

from routes import createApp
from config import DOT_ENV

if __name__ == '__main__':
    dotenv.load_dotenv( dotenv_path=DOT_ENV )
    server = createApp('dev')
    server.run(host='0.0.0.0', port='3000')