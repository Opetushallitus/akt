package fi.oph.akt.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Order(value = Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
public class ControllerExceptionAdvice {

	private static final Logger LOG = LoggerFactory.getLogger(ControllerExceptionAdvice.class);

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Object> handleAll(final Exception ex) {
		LOG.error("Exception caught", ex);

		return new ResponseEntity<>("exception: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<Object> handleRuntime(final RuntimeException ex) {
		LOG.error("RuntimeException caught", ex);

		return new ResponseEntity<>("runtime exception: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
	}

}
