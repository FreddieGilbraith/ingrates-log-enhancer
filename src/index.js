export default function createLogEnhancer(prefix, logHandler = console) {
	return (prov) => {
		const { self, name } = prov;

		function createLogger(method) {
			return function doLog(...args) {
				logHandler[method]?.(prefix, self, name, ...args);
			};
		}

		const log = createLogger("log");
		log.debug = createLogger("debug");
		log.error = createLogger("error");
		log.info = createLogger("info");
		log.warn = createLogger("warn");

		return {
			log,
		};
	};
}
