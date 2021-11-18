package fi.oph.akt.onr.model.yhteystieto;

@FunctionalInterface
public interface Setter<T, E> {

	void set(T obj, E value);

}
